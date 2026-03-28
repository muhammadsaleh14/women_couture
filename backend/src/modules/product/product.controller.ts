import path from "path";
import type { Request, Response, NextFunction } from "express";
import * as productService from "./product.service";
import {
  CreateProductBodySchema,
  ProductParamsSchema,
  ProductQuerySchema,
  SaveProductBodySchema,
  UpdateProductBodySchema,
} from "./product.schema";

function variantFilesToRelativeUrls(filesByVariant: Map<number, Express.Multer.File[]>) {
  const variantImages = new Map<number, string[]>();
  for (const [idx, files] of filesByVariant) {
    variantImages.set(
      idx,
      files.map((f) => "/" + path.relative(process.cwd(), f.path).replace(/\\/g, "/")),
    );
  }
  return variantImages;
}

function parseMultipartBody(req: Request) {
  if (req.is("application/json")) {
    return { data: req.body, filesByVariant: new Map<number, Express.Multer.File[]>() };
  }

  const raw = req.body?.data;
  const data = typeof raw === "string" ? JSON.parse(raw) : raw || {};

  const filesByVariant = new Map<number, Express.Multer.File[]>();
  const files = (req.files as Express.Multer.File[]) || [];
  for (const file of files) {
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
    const variantImages = variantFilesToRelativeUrls(filesByVariant);

    if (req.is("application/json")) {
      const body = CreateProductBodySchema.parse(data);
      const result = await productService.createProduct(body, undefined);
      res.status(201).json(result);
      return;
    }

    const body = SaveProductBodySchema.parse(data);
    const result = await productService.createProduct(
      {
        name: body.name,
        description: body.description,
        type: body.type,
        variants: body.variants.map((v) => ({
          sku: v.sku ?? undefined,
          salePrice: v.salePrice,
          purchasePrice: v.purchasePrice ?? undefined,
        })),
      },
      variantImages,
    );
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const query = ProductQuerySchema.parse(req.query);

    const isActive =
      query.isActive === "true" ? true : query.isActive === "false" ? false : undefined;

    const result = await productService.getAllProducts({
      skip: query.skip,
      take: query.take,
      isActive,
    });

    res.json(result);
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

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const params = ProductParamsSchema.parse(req.params);
    const { data, filesByVariant } = parseMultipartBody(req);
    const variantImages = variantFilesToRelativeUrls(filesByVariant);

    if (req.is("application/json")) {
      const body = UpdateProductBodySchema.parse(data);
      const result = await productService.updateProduct(params.productId, body);
      const full = await productService.getProductById(params.productId);
      res.status(200).json(full || result);
      return;
    }

    const body = SaveProductBodySchema.parse(data);
    const full = await productService.replaceProductFull(params.productId, body, variantImages);
    res.status(200).json(full);
  } catch (err) {
    if (err instanceof Error && err.message.includes("Record to update not found")) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    next(err);
  }
}
