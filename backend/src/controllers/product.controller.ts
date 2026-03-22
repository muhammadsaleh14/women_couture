import type { Request, Response, NextFunction } from "express";
import * as productService from "../services/product.service";
import {
  CreateProductBodySchema,
  CreateVariantBodySchema,
  AdjustStockBodySchema,
  ProductParamsSchema,
  ProductVariantParamsSchema,
  ProductQuerySchema,
  UpdateProductBodySchema,
} from "../schemas/product.schema";

/**
 * Parse multipart request: JSON lives in req.body.data (string),
 * image files live in req.files with fieldnames like "variants[0]", "variants[1]", etc.
 */
function parseMultipartBody(req: Request) {
  // If Content-Type is application/json, body is already parsed
  if (req.is("application/json")) {
    return { data: req.body, filesByVariant: new Map<number, Express.Multer.File[]>() };
  }

  // Multipart: the JSON payload is in the "data" field
  const raw = req.body?.data;
  const data = typeof raw === "string" ? JSON.parse(raw) : raw || {};

  // Group uploaded files by variant index
  const filesByVariant = new Map<number, Express.Multer.File[]>();
  const files = (req.files as Express.Multer.File[]) || [];
  for (const file of files) {
    // fieldname looks like "variants[0]", "variants[1]", etc.
    const match = file.fieldname.match(/^variants\[(\d+)\]$/);
    if (match) {
      const idx = parseInt(match[1], 10);
      if (!filesByVariant.has(idx)) filesByVariant.set(idx, []);
      filesByVariant.get(idx)!.push(file);
    }
  }

  return { data, filesByVariant };
}

export async function createProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const { data, filesByVariant } = parseMultipartBody(req);
    const body = CreateProductBodySchema.parse(data);

    // Build image paths per variant index
    const variantImages = new Map<number, string[]>();
    for (const [idx, files] of filesByVariant) {
      variantImages.set(
        idx,
        files.map((f) => `/${f.path.replace(/\\/g, "/")}`),
      );
    }

    const result = await productService.createProduct(body, variantImages);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const query = ProductQuerySchema.parse(req.query);
    
    // Transform 'true'/'false' strings to boolean for the service
    const isActive = query.isActive === "true" ? true : query.isActive === "false" ? false : undefined;

    const products = await productService.getAllProducts({
      skip: query.skip,
      take: query.take,
      isActive,
    });
    
    res.json(products);
  } catch (err) {
    next(err);
  }
}

export async function getProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const params = ProductParamsSchema.parse(req.params);
    const product = await productService.getProductById(params.productId);
    
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function createVariant(req: Request, res: Response, next: NextFunction) {
  try {
    const params = ProductParamsSchema.parse(req.params);
    const body = CreateVariantBodySchema.parse(req.body);

    const result = await productService.createVariant(params.productId, body);
    res.status(201).json(result);
  } catch (err) {
    if (err instanceof Error && (err.message === "Product not found" || err.message.includes("already exists"))) {
      res.status(400).json({ message: err.message });
      return;
    }
    next(err);
  }
}

export async function adjustStock(req: Request, res: Response, next: NextFunction) {
  try {
    const params = ProductVariantParamsSchema.parse(req.params);
    const body = AdjustStockBodySchema.parse(req.body);

    const result = await productService.adjustStock(params.variantId, body.type, body.quantity, body.notes);
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof Error && err.message.includes("Insufficient stock")) {
      res.status(400).json({ message: err.message });
      return;
    }
    next(err);
  }
}

export async function uploadImage(req: Request, res: Response, next: NextFunction) {
  try {
    const params = ProductVariantParamsSchema.parse(req.params);
    const file = req.file; // From multer

    if (!file) {
      res.status(400).json({ message: "No image file provided" });
      return;
    }

    // Convert file path into a workable URL (e.g. replacing backslashes and prefixing)
    const normalizedPath = file.path.replace(/\\/g, "/");
    const url = `/${normalizedPath}`; 

    const result = await productService.addImage(params.variantId, url);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const params = ProductParamsSchema.parse(req.params);
    const { data, filesByVariant } = parseMultipartBody(req);
    const body = UpdateProductBodySchema.parse(data);

    const result = await productService.updateProduct(params.productId, body);

    // Upload any new images to their respective variants
    // filesByVariant keys are indices, but for edit we need actual variant IDs
    // The frontend sends the variant IDs in the data payload
    const variantIds: string[] = data.variantIds || [];
    for (const [idx, files] of filesByVariant) {
      const variantId = variantIds[idx];
      if (!variantId) continue;
      for (const file of files) {
        const url = `/${file.path.replace(/\\/g, "/")}`;
        await productService.addImage(variantId, url);
      }
    }

    // Re-fetch the full product with variants+images for the response
    const full = await productService.getProductById(params.productId);
    res.status(200).json(full || result);
  } catch (err) {
    if (err instanceof Error && err.message.includes("Record to update not found")) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    next(err);
  }
}
