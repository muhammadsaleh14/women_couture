import { Router } from "express";
import * as productController from "../controllers/product.controller";
import { authenticate } from "../middleware/authenticate";
import { authorizeRole } from "../middleware/authorize";
import { upload } from "../middleware/upload";

export const productRouter = Router();

// All product routes require authentication AND Admin role
productRouter.use(authenticate);
productRouter.use(authorizeRole("ADMIN"));

// List products
productRouter.get("/", productController.getProducts);

// Get single product
productRouter.get("/:productId", productController.getProduct);

// Create a new base product (multipart: JSON in "data" field + image files in "variants[i]" fields)
productRouter.post("/", upload.any(), productController.createProduct);

// Add a variant to a product
productRouter.post("/:productId/variants", productController.createVariant);

// Update product (multipart: JSON in "data" field + new image files in "variants[i]" fields)
productRouter.patch("/:productId", upload.any(), productController.updateProduct);
