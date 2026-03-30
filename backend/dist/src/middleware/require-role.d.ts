import type { UserRole } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
export declare function requireRole(...allowed: UserRole[]): (req: Request, _res: Response, next: NextFunction) => void;
