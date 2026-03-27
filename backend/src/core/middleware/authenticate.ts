import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/http-error";
import * as authService from "../../modules/auth/auth.service";

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      next(new HttpError(401, "Missing or invalid Authorization header"));
      return;
    }
    const token = header.slice("Bearer ".length).trim();
    if (!token) {
      next(new HttpError(401, "Missing token"));
      return;
    }
    const payload = authService.verifyAccessToken(token);
    req.auth = {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
    next();
  } catch (err) {
    next(err);
  }
}
