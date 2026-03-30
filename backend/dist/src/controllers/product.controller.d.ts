import type { Request, Response, NextFunction } from "express";
export declare function createProduct(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getProducts(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function createVariant(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function adjustStock(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function uploadImage(req: Request, res: Response, next: NextFunction): Promise<void>;
