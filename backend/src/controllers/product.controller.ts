import type { Request, Response, NextFunction } from "express";
import * as productService from "../services/product.service";
import {
  CreateProductBodySchema,
  CreateVariantBodySchema,
  AdjustStockBodySchema,
  ProductParamsSchema,
  ProductVariantParamsSchema,
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
    const products = await productService.getAllProducts();
    res.json(products);
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
