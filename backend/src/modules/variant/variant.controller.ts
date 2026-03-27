import path from "path";
import type { Request, Response, NextFunction } from "express";
import * as variantService from "./variant.service";
import {
  CreateVariantBodySchema,
  AdjustStockBodySchema,
  ProductParamsSchema,
  ProductVariantParamsSchema,
} from "../product/product.schema";
import { UpdateVariantBodySchema } from "./variant.schema";
import * as productService from "../product/product.service";

export async function createVariant(req: Request, res: Response, next: NextFunction) {
  try {
    const params = ProductParamsSchema.parse(req.params);
    const body = CreateVariantBodySchema.parse(req.body);

    const result = await variantService.createVariant(params.productId, body);
    res.status(201).json(result);
  } catch (err) {
    if (
      err instanceof Error &&
      (err.message === "Product not found" || err.message.includes("already exists"))
    ) {
      res.status(400).json({ message: err.message });
      return;
    }
    next(err);
  }
}

export async function updateVariant(req: Request, res: Response, next: NextFunction) {
  try {
    const params = ProductVariantParamsSchema.parse(req.params);
    const body = UpdateVariantBodySchema.parse(req.body);

    const result = await variantService.updateVariant(params.variantId, body);
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof Error && err.message.includes("Record to update not found")) {
      res.status(404).json({ message: "Variant not found" });
      return;
    }
    next(err);
  }
}

export async function deleteVariant(req: Request, res: Response, next: NextFunction) {
  try {
    const params = ProductVariantParamsSchema.parse(req.params);
    await variantService.deleteVariant(params.variantId);
    res.status(204).send();
  } catch (err) {
    if (err instanceof Error && err.message === "Variant not found") {
      res.status(404).json({ message: "Variant not found" });
      return;
    }
    next(err);
  }
}

export async function adjustStock(req: Request, res: Response, next: NextFunction) {
  try {
    const params = ProductVariantParamsSchema.parse(req.params);
    const body = AdjustStockBodySchema.parse(req.body);

    const result = await productService.adjustStock(
      params.variantId,
      body.type,
      body.quantity,
      body.notes,
    );
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
    const file = req.file;

    if (!file) {
      res.status(400).json({ message: "No image file provided" });
      return;
    }

    const url = "/" + path.relative(process.cwd(), file.path).replace(/\\/g, "/");

    const result = await variantService.addImage(params.variantId, url);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function deleteImage(req: Request, res: Response, next: NextFunction) {
  try {
    const imageId = req.params.imageId as string;
    await variantService.deleteImage(imageId);
    res.status(204).send();
  } catch (err) {
    if (err instanceof Error && err.message.includes("Record to delete does not exist")) {
      res.status(404).json({ message: "Image not found" });
      return;
    }
    next(err);
  }
}
