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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.optionalAuthenticate = optionalAuthenticate;
const http_error_1 = require("../errors/http-error");
const authService = __importStar(require("../../modules/auth/auth.service"));
function authenticate(req, _res, next) {
    try {
        const header = req.headers.authorization;
        if (!header?.startsWith("Bearer ")) {
            next(new http_error_1.HttpError(401, "Missing or invalid Authorization header"));
            return;
        }
        const token = header.slice("Bearer ".length).trim();
        if (!token) {
            next(new http_error_1.HttpError(401, "Missing token"));
            return;
        }
        const payload = authService.verifyAccessToken(token);
        req.auth = {
            userId: payload.sub,
            username: payload.username,
            role: payload.role,
        };
        next();
    }
    catch (err) {
        next(err);
    }
}
/**
 * If `Authorization: Bearer` is valid, set `req.auth`.
 * Invalid or missing token is ignored so public routes (e.g. checkout) still succeed as guest.
 */
function optionalAuthenticate(req, _res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        next();
        return;
    }
    const token = header.slice("Bearer ".length).trim();
    if (!token) {
        next();
        return;
    }
    try {
        const payload = authService.verifyAccessToken(token);
        req.auth = {
            userId: payload.sub,
            username: payload.username,
            role: payload.role,
        };
    }
    catch {
        // stale token in localStorage should not block guest checkout
    }
    next();
}
//# sourceMappingURL=authenticate.js.map