import { Router } from "express";
import * as variantController from "../controllers/variant.controller";
import { authenticate } from "../middleware/authenticate";
import { authorizeRole } from "../middleware/authorize";
import { upload } from "../middleware/upload";

export const variantRouter = Router();
variantRouter.use(authenticate);
variantRouter.use(authorizeRole("ADMIN"));

// Update variant details
variantRouter.patch("/:variantId", variantController.updateVariant);

// Delete a variant
variantRouter.delete("/:variantId", variantController.deleteVariant);

// Adjust stock
variantRouter.post("/:variantId/stock", variantController.adjustStock);

// Add an image to a variant
variantRouter.post("/:variantId/images", upload.single("image"), variantController.uploadImage);

// Delete an image
variantRouter.delete("/images/:imageId", variantController.deleteImage);
