import type { UserRole } from "@prisma/client";
export type AuthResult = {
    accessToken: string;
    user: {
        id: string;
        username: string;
        role: UserRole;
    };
};
export declare function register(username: string, password: string): Promise<AuthResult>;
export declare function login(username: string, password: string): Promise<AuthResult>;
export type JwtUserPayload = {
    sub: string;
    username: string;
    role: UserRole;
};
export declare function verifyAccessToken(token: string): JwtUserPayload;
