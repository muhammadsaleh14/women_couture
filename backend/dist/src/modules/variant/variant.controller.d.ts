import type { Request, Response, NextFunction } from "express";
export declare function createVariant(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updateVariant(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function deleteVariant(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function listStockMoves(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function adjustStock(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function uploadImage(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function deleteImage(req: Request, res: Response, next: NextFunction): Promise<void>;
