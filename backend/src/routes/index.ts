import { Router } from "express";
import { authRouter } from "../modules/auth/auth.routes";
import { productRouter } from "../modules/product/product.routes";
import { variantRouter } from "../modules/variant/variant.routes";
import { echoRouter } from "../modules/common/echo.routes";
import { healthRouter } from "../modules/common/health.routes";
import { homeHeroRouter } from "../modules/home-hero/home-hero.routes";

export const routes = Router();

routes.use("/health", healthRouter);

const v1Router = Router();
v1Router.use("/auth", authRouter);
v1Router.use("/products", productRouter);
v1Router.use("/home-hero-slides", homeHeroRouter);
v1Router.use("/variants", variantRouter);
v1Router.use("/echo", echoRouter);

routes.use("/api/v1", v1Router);
