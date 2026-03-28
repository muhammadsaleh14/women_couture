import type { Request, Response, NextFunction } from "express";
import * as homeHeroService from "./home-hero.service";
import {
  CreateHomeHeroSlideBodySchema,
  HomeHeroSlideParamsSchema,
  ReorderHomeHeroSlidesBodySchema,
  UpdateHomeHeroSlideBodySchema,
} from "./home-hero.schema";

export async function getPublicSlides(_req: Request, res: Response, next: NextFunction) {
  try {
    const slides = await homeHeroService.listResolvedPublic();
    res.json(slides);
  } catch (err) {
    next(err);
  }
}

export async function getManageSlides(_req: Request, res: Response, next: NextFunction) {
  try {
    const slides = await homeHeroService.listAllSlideRecords();
    res.json(slides);
  } catch (err) {
    next(err);
  }
}

export async function createSlide(req: Request, res: Response, next: NextFunction) {
  try {
    const body = CreateHomeHeroSlideBodySchema.parse(req.body);
    const slide = await homeHeroService.createSlide(body);
    res.status(201).json(slide);
  } catch (err) {
    next(err);
  }
}

export async function updateSlide(req: Request, res: Response, next: NextFunction) {
  try {
    const { slideId } = HomeHeroSlideParamsSchema.parse(req.params);
    const body = UpdateHomeHeroSlideBodySchema.parse(req.body);
    const slide = await homeHeroService.updateSlide(slideId, body);
    res.json(slide);
  } catch (err) {
    next(err);
  }
}

export async function deleteSlide(req: Request, res: Response, next: NextFunction) {
  try {
    const { slideId } = HomeHeroSlideParamsSchema.parse(req.params);
    await homeHeroService.deleteSlide(slideId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function reorderSlides(req: Request, res: Response, next: NextFunction) {
  try {
    const body = ReorderHomeHeroSlidesBodySchema.parse(req.body);
    await homeHeroService.reorderSlides(body.orderedIds);
    const slides = await homeHeroService.listAllSlideRecords();
    res.json(slides);
  } catch (err) {
    next(err);
  }
}
