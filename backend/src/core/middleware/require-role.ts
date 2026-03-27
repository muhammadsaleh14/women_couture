import type { UserRole } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/http-error";

export function requireRole(...allowed: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      next(new HttpError(401, "Unauthorized"));
      return;
    }
    if (!allowed.includes(req.auth.role)) {
      next(new HttpError(403, "Forbidden"));
      return;
    }
    next();
  };
}
