export type UserRole = "CUSTOMER" | "ADMIN";

export type AuthUser = {
  id: string;
  username: string;
  role: UserRole;
};
