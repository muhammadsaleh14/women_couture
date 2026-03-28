import { Router } from "express";
import * as productController from "./product.controller";
import * as variantController from "../variant/variant.controller";
import { authenticate } from "../../core/middleware/authenticate";
import { authorizeRole } from "../../core/middleware/authorize";
import { upload } from "../../core/middleware/upload";

export const productRouter = Router();

/** Storefront catalog: list + detail without auth. */
productRouter.get("/", productController.getProducts);
productRouter.get("/:productId", productController.getProduct);

const protectedProductRouter = Router();
protectedProductRouter.use(authenticate);
protectedProductRouter.use(authorizeRole("ADMIN"));

protectedProductRouter.post("/", upload.any(), productController.createProduct);
protectedProductRouter.post("/:productId/variants", variantController.createVariant);
protectedProductRouter.patch("/:productId", upload.any(), productController.updateProduct);

productRouter.use(protectedProductRouter);
