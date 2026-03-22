import type { UserPublic } from "@/api/generated/api";

export type AuthUser = UserPublic;
export type UserRole = AuthUser["role"];
