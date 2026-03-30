import type { UserRole } from "@prisma/client";
export declare function findByUsername(username: string): Promise<{
    id: string;
    username: string;
    role: import(".prisma/client").$Enums.UserRole;
    createdAt: Date;
    passwordHash: string;
    email: string | null;
} | null>;
export declare function findById(id: string): Promise<{
    id: string;
    username: string;
    role: import(".prisma/client").$Enums.UserRole;
    createdAt: Date;
    passwordHash: string;
    email: string | null;
} | null>;
export declare function createUser(data: {
    username: string;
    passwordHash: string;
    role: UserRole;
}): Promise<{
    id: string;
    username: string;
    role: import(".prisma/client").$Enums.UserRole;
    createdAt: Date;
    passwordHash: string;
    email: string | null;
}>;
