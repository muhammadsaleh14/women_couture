"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = requireRole;
const http_error_1 = require("../errors/http-error");
function requireRole(...allowed) {
    return (req, _res, next) => {
        if (!req.auth) {
            next(new http_error_1.HttpError(401, "Unauthorized"));
            return;
        }
        if (!allowed.includes(req.auth.role)) {
            next(new http_error_1.HttpError(403, "Forbidden"));
            return;
        }
        next();
    };
}
//# sourceMappingURL=require-role.js.map