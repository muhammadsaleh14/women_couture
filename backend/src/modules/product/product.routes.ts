import { Router } from "express";
import * as productController from "./product.controller";
import * as variantController from "../variant/variant.controller";
import { authenticate } from "../../core/middleware/authenticate";
import { authorizeRole } from "../../core/middleware/authorize";
import { upload } from "../../core/middleware/upload";

export const productRouter = Router();

productRouter.use(authenticate);
productRouter.use(authorizeRole("ADMIN"));

productRouter.get("/", productController.getProducts);

productRouter.get("/:productId", productController.getProduct);

productRouter.post("/", upload.any(), productController.createProduct);

productRouter.post("/:productId/variants", variantController.createVariant);

productRouter.patch("/:productId", upload.any(), productController.updateProduct);
