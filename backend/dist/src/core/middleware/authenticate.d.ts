import type { NextFunction, Request, Response } from "express";
export declare function authenticate(req: Request, _res: Response, next: NextFunction): void;
/**
 * If `Authorization: Bearer` is valid, set `req.auth`.
 * Invalid or missing token is ignored so public routes (e.g. checkout) still succeed as guest.
 */
export declare function optionalAuthenticate(req: Request, _res: Response, next: NextFunction): void;
