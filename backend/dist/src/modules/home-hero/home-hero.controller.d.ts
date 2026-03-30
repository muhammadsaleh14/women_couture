import type { Request, Response, NextFunction } from "express";
export declare function getPublicSlides(_req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getManageSlides(_req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function createSlide(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updateSlide(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function deleteSlide(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function reorderSlides(req: Request, res: Response, next: NextFunction): Promise<void>;
