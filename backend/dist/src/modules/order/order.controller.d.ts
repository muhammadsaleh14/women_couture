import type { Request, Response, NextFunction } from "express";
export declare function createOrder(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function listOrders(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getOrder(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updateOrder(req: Request, res: Response, next: NextFunction): Promise<void>;
