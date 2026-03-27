import type { UserPublic } from "@/core/api/generated/api";

export type AuthUser = UserPublic;
export type UserRole = AuthUser["role"];
