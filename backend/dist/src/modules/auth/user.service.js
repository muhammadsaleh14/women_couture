"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByUsername = findByUsername;
exports.findById = findById;
exports.createUser = createUser;
const prisma_1 = require("../../core/database/prisma");
async function findByUsername(username) {
    return prisma_1.prisma.user.findUnique({ where: { username } });
}
async function findById(id) {
    return prisma_1.prisma.user.findUnique({ where: { id } });
}
async function createUser(data) {
    return prisma_1.prisma.user.create({ data });
}
//# sourceMappingURL=user.service.js.map