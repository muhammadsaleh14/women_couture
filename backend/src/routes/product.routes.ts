import { Router } from "express";
import * as productController from "../controllers/product.controller";
import { authenticate } from "../middleware/authenticate";
import { upload } from "../middleware/upload";

export const productRouter = Router();

// Base Product endpoints
// All product routes will require authentication. Assuming admin specific routes.
productRouter.use(authenticate);

// List products
productRouter.get("/", productController.getProducts);

// Create a new base product
productRouter.post("/", productController.createProduct);

// Add a variant to a product
productRouter.post("/:productId/variants", productController.createVariant);

// ---------------------------------------------------------
// Below we have endpoints specific to a VARIANT
// We could put these in a separate variant.routes.ts, or keep them here for cohesion
// ---------------------------------------------------------

export const variantRouter = Router();
variantRouter.use(authenticate);

// Adjust stock
variantRouter.post("/:variantId/stock", productController.adjustStock);

// Add an image to a variant
// We expect a single file in 'image' field inside multipart/form-data
variantRouter.post("/:variantId/images", upload.single("image"), productController.uploadImage);

