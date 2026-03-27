import { Router } from "express";
import * as variantController from "./variant.controller";
import { authenticate } from "../../core/middleware/authenticate";
import { authorizeRole } from "../../core/middleware/authorize";
import { upload } from "../../core/middleware/upload";

export const variantRouter = Router();
variantRouter.use(authenticate);
variantRouter.use(authorizeRole("ADMIN"));

variantRouter.patch("/:variantId", variantController.updateVariant);

variantRouter.delete("/:variantId", variantController.deleteVariant);

variantRouter.post("/:variantId/stock", variantController.adjustStock);

variantRouter.post("/:variantId/images", upload.single("image"), variantController.uploadImage);

variantRouter.delete("/images/:imageId", variantController.deleteImage);
