import type { Request, Response, NextFunction } from "express";
export declare function createProduct(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getProducts(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getProduct(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updateProduct(req: Request, res: Response, next: NextFunction): Promise<void>;
