"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const error_handler_1 = require("./core/middleware/error-handler");
const generate_spec_1 = require("./core/openapi/generate-spec");
const routes_1 = require("./routes");
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, helmet_1.default)({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
    app.use((0, cors_1.default)({
        origin: true,
        credentials: true,
    }));
    app.use(express_1.default.json());
    app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
    app.get("/openapi.json", (_req, res) => {
        res.json((0, generate_spec_1.generateOpenAPIDocument)());
    });
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup((0, generate_spec_1.generateOpenAPIDocument)()));
    app.use(routes_1.routes);
    app.use(error_handler_1.errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map