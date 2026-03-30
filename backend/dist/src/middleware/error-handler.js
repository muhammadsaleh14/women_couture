"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const http_error_1 = require("../lib/http-error");
function errorHandler(err, _req, res, _next) {
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            message: "Validation failed",
            errors: err.flatten(),
        });
    }
    // Handle Prisma Database constraint errors
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
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
    if (err instanceof http_error_1.HttpError) {
        return res.status(err.statusCode).json({ message: err.message });
    }
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
}
//# sourceMappingURL=error-handler.js.map