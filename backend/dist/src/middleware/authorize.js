"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = authorizeRole;
const http_error_1 = require("../lib/http-error");
function authorizeRole(...allowedRoles) {
    return (req, _res, next) => {
        const auth = req.auth;
        // The request must already pass through the authenticate middleware
        if (!auth) {
            next(new http_error_1.HttpError(401, "Authentication required"));
            return;
        }
        if (!allowedRoles.includes(auth.role)) {
            next(new http_error_1.HttpError(403, "Forbidden: You do not have the required permissions"));
            return;
        }
        next();
    };
}
//# sourceMappingURL=authorize.js.map