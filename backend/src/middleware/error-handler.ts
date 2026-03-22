import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { HttpError } from "../lib/http-error";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      errors: err.flatten(),
    });
  }

  // Handle Prisma Database constraint errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      // Unique constraint failed
      return res.status(409).json({ message: "A record with this data already exists" });
    }
    if (err.code === "P2025") {
      // Record to update/delete not found
      return res.status(404).json({ message: "Record not found" });
    }
    // For other known errors, default to 400
    return res.status(400).json({ message: "Database operation failed", code: err.code });
  }

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ message: err.message });
  }


  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
}
