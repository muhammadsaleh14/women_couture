import type { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";
import { LoginBodySchema, RegisterBodySchema } from "./auth.schema";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const body = RegisterBodySchema.parse(req.body);
    const result = await authService.register(body.username, body.password);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const body = LoginBodySchema.parse(req.body);
    const result = await authService.login(body.username, body.password);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export function me(req: Request, res: Response) {
  const auth = req.auth;
  if (!auth) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  res.json({
    id: auth.userId,
    username: auth.username,
    role: auth.role,
  });
}
