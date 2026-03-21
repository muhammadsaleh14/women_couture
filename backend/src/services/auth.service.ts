import type { User, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import { env } from "../env";
import { HttpError } from "../lib/http-error";
import * as userService from "./user.service";

export type AuthResult = {
  accessToken: string;
  user: { id: string; username: string; role: UserRole };
};

export async function register(
  username: string,
  password: string,
): Promise<AuthResult> {
  const existing = await userService.findByUsername(username);
  if (existing) {
    throw new HttpError(409, "Username already taken");
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await userService.createUser({
    username,
    passwordHash,
    role: "CUSTOMER",
  });
  return issueTokens(user);
}

export async function login(
  username: string,
  password: string,
): Promise<AuthResult> {
  const user = await userService.findByUsername(username);
  if (!user) {
    throw new HttpError(401, "Invalid credentials");
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    throw new HttpError(401, "Invalid credentials");
  }
  return issueTokens(user);
}

function issueTokens(user: User): AuthResult {
  const signOptions: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN,
  };
  const accessToken = jwt.sign(
    {
      sub: user.id,
      username: user.username,
      role: user.role,
    },
    env.JWT_SECRET,
    signOptions,
  );
  return {
    accessToken,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
  };
}

export type JwtUserPayload = {
  sub: string;
  username: string;
  role: UserRole;
};

export function verifyAccessToken(token: string): JwtUserPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload &
      JwtUserPayload;
    if (
      typeof decoded.sub !== "string" ||
      typeof decoded.username !== "string" ||
      (decoded.role !== "CUSTOMER" && decoded.role !== "ADMIN")
    ) {
      throw new HttpError(401, "Invalid token payload");
    }
    return {
      sub: decoded.sub,
      username: decoded.username,
      role: decoded.role,
    };
  } catch (err) {
    if (err instanceof HttpError) {
      throw err;
    }
    throw new HttpError(401, "Invalid or expired token");
  }
}
