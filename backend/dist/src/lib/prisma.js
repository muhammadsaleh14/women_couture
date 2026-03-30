"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const globalForPrisma = globalThis;
function createPrismaClient() {
    const url = process.env.DATABASE_URL;
    if (!url) {
        throw new Error("DATABASE_URL is required for Prisma");
    }
    const pool = globalForPrisma.pgPool ?? new pg_1.Pool({ connectionString: url });
    if (process.env.NODE_ENV !== "production") {
        globalForPrisma.pgPool = pool;
    }
    const adapter = new adapter_pg_1.PrismaPg(pool);
    return new client_1.PrismaClient({
        adapter,
        log: process.env.NODE_ENV === "development"
            ? ["query", "error", "warn"]
            : ["error"],
    });
}
exports.prisma = globalForPrisma.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = exports.prisma;
}
//# sourceMappingURL=prisma.js.map