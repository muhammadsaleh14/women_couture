import { Router } from "express";
import { authRouter } from "./auth.routes";
import { productRouter, variantRouter } from "./product.routes";
import { echoRouter } from "./echo";
import { healthRouter } from "./health";

export const routes = Router();

routes.use("/health", healthRouter);
routes.use("/api/v1/auth", authRouter);
routes.use("/api/v1/admin/products", productRouter);
routes.use("/api/v1/admin/variants", variantRouter);
routes.use("/api/v1/echo", echoRouter);

