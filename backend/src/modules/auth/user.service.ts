import type { UserRole } from "@prisma/client";
import { prisma } from "../../core/database/prisma";

export async function findByUsername(username: string) {
  return prisma.user.findUnique({ where: { username } });
}

export async function findById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function createUser(data: {
  username: string;
  passwordHash: string;
  role: UserRole;
}) {
  return prisma.user.create({ data });
}
