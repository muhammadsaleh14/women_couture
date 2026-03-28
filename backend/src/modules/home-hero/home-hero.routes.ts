import { Router } from "express";
import * as homeHeroController from "./home-hero.controller";
import { authenticate } from "../../core/middleware/authenticate";
import { authorizeRole } from "../../core/middleware/authorize";

export const homeHeroRouter = Router();

homeHeroRouter.get("/", homeHeroController.getPublicSlides);

const protectedHomeHeroRouter = Router();
protectedHomeHeroRouter.use(authenticate);
protectedHomeHeroRouter.use(authorizeRole("ADMIN"));

protectedHomeHeroRouter.get("/manage", homeHeroController.getManageSlides);
protectedHomeHeroRouter.post("/", homeHeroController.createSlide);
protectedHomeHeroRouter.patch("/reorder", homeHeroController.reorderSlides);
protectedHomeHeroRouter.patch("/:slideId", homeHeroController.updateSlide);
protectedHomeHeroRouter.delete("/:slideId", homeHeroController.deleteSlide);

homeHeroRouter.use(protectedHomeHeroRouter);
