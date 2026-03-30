"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOpenAPIDocument = generateOpenAPIDocument;
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
const registry_1 = require("./registry");
require("./paths/auth.paths");
require("./paths/common.paths");
require("./paths/product.paths");
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
                url: `http://localhost:${serverPort()}`,
            },
        ],
    });
}
//# sourceMappingURL=generate-spec.js.map