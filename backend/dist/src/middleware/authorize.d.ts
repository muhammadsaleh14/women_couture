import type { NextFunction, Request, Response } from "express";
import { UserRole } from "@prisma/client";
export declare function authorizeRole(...allowedRoles: UserRole[]): (req: Request, _res: Response, next: NextFunction) => void;
