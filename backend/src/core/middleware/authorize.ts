import type { NextFunction, Request, Response } from "express";
import { UserRole } from "@prisma/client";
import { HttpError } from "../errors/http-error";

export function authorizeRole(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const auth = req.auth;

    if (!auth) {
      next(new HttpError(401, "Authentication required"));
      return;
    }

    if (!allowedRoles.includes(auth.role)) {
      next(
        new HttpError(
          403,
          "Forbidden: You do not have the required permissions",
        ),
      );
      return;
    }

    next();
  };
}
