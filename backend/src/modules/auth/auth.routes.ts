import { Router } from "express";
import * as authController from "./auth.controller";
import { authenticate } from "../../core/middleware/authenticate";

export const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/me", authenticate, authController.me);
