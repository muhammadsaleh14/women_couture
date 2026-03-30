"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.echoRouter = void 0;
const express_1 = require("express");
const validate_1 = require("../../core/middleware/validate");
const common_schema_1 = require("./common.schema");
exports.echoRouter = (0, express_1.Router)();
exports.echoRouter.post("/", (0, validate_1.validateBody)(common_schema_1.EchoBodySchema), (req, res) => {
    const { message } = req.body;
    res.json({ echo: message });
});
//# sourceMappingURL=echo.routes.js.map