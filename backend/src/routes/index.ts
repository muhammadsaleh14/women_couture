import { Router } from "express";
import { authRouter } from "./auth.routes";
import { productRouter } from "./product.routes";
import { variantRouter } from "./variant.routes";
import { echoRouter } from "./echo";
import { healthRouter } from "./health";

export const routes = Router();

routes.use("/health", healthRouter);

const v1Router = Router();
v1Router.use("/auth", authRouter);
v1Router.use("/admin/products", productRouter);
v1Router.use("/admin/variants", variantRouter);
v1Router.use("/echo", echoRouter);

routes.use("/api/v1", v1Router);
