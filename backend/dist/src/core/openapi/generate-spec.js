"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOpenAPIDocument = generateOpenAPIDocument;
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
const registry_1 = require("./registry");
require("../../modules/auth/openapi.paths");
require("../../modules/common/openapi.paths");
require("../../modules/home-hero/openapi.paths");
require("../../modules/product/openapi.paths");
require("../../modules/variant/openapi.paths");
require("../../modules/order/openapi.paths");
require("../../modules/notification/openapi.paths");
function serverPort() {
    const raw = process.env.PORT;
    if (raw === undefined || raw === "") {
        return 3000;
    }
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : 3000;
}
function generateOpenAPIDocument() {
    const generator = new zod_to_openapi_1.OpenApiGeneratorV3(registry_1.openAPIRegistry.definitions);
    return generator.generateDocument({
        openapi: "3.0.0",
        info: {
            title: "Women Couture API",
            version: "0.1.0",
            description: "REST API for Women Couture",
        },
        servers: [
            {
                url: `http://localhost:${serverPort()}/api/v1`,
            },
        ],
    });
}
//# sourceMappingURL=generate-spec.js.map