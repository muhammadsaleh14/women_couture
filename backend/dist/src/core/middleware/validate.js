"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
function validateBody(schema) {
    return (req, _res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            next(result.error);
            return;
        }
        req.body = result.data;
        next();
    };
}
//# sourceMappingURL=validate.js.map