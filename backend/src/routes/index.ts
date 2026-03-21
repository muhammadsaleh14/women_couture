import { Router } from "express";
import { authRouter } from "./auth.routes";
import { echoRouter } from "./echo";
import { healthRouter } from "./health";

export const routes = Router();

routes.use("/health", healthRouter);
routes.use("/api/v1/auth", authRouter);
routes.use("/api/v1/echo", echoRouter);
