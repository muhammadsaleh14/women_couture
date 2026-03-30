"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.verifyAccessToken = verifyAccessToken;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../env");
const http_error_1 = require("../lib/http-error");
const userService = __importStar(require("./user.service"));
async function register(username, password) {
    const existing = await userService.findByUsername(username);
    if (existing) {
        throw new http_error_1.HttpError(409, "Username already taken");
    }
    const passwordHash = await bcrypt_1.default.hash(password, 12);
    const user = await userService.createUser({
        username,
        passwordHash,
        role: "CUSTOMER",
    });
    return issueTokens(user);
}
async function login(username, password) {
    const user = await userService.findByUsername(username);
    if (!user) {
        throw new http_error_1.HttpError(401, "Invalid credentials");
    }
    const ok = await bcrypt_1.default.compare(password, user.passwordHash);
    if (!ok) {
        throw new http_error_1.HttpError(401, "Invalid credentials");
    }
    return issueTokens(user);
}
function issueTokens(user) {
    const signOptions = {
        expiresIn: env_1.env.JWT_EXPIRES_IN,
    };
    const accessToken = jsonwebtoken_1.default.sign({
        sub: user.id,
        username: user.username,
        role: user.role,
    }, env_1.env.JWT_SECRET, signOptions);
    return {
        accessToken,
        user: {
            id: user.id,
            username: user.username,
            role: user.role,
        },
    };
}
function verifyAccessToken(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        if (typeof decoded.sub !== "string" ||
            typeof decoded.username !== "string" ||
            (decoded.role !== "CUSTOMER" && decoded.role !== "ADMIN")) {
            throw new http_error_1.HttpError(401, "Invalid token payload");
        }
        return {
            sub: decoded.sub,
            username: decoded.username,
            role: decoded.role,
        };
    }
    catch (err) {
        if (err instanceof http_error_1.HttpError) {
            throw err;
        }
        throw new http_error_1.HttpError(401, "Invalid or expired token");
    }
}
//# sourceMappingURL=auth.service.js.map