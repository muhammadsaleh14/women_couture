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

export async function createProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const body = CreateProductBodySchema.parse(req.body);
    const result = await productService.createProduct(body);
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
    const body = UpdateProductBodySchema.parse(req.body);

    const result = await productService.updateProduct(params.productId, body);
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof Error && err.message.includes("Record to update not found")) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    next(err);
  }
}
