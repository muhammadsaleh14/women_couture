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
exports.productRouter = void 0;
const express_1 = require("express");
const productController = __importStar(require("./product.controller"));
const variantController = __importStar(require("../variant/variant.controller"));
const authenticate_1 = require("../../core/middleware/authenticate");
const authorize_1 = require("../../core/middleware/authorize");
const upload_1 = require("../../core/middleware/upload");
exports.productRouter = (0, express_1.Router)();
/** Storefront catalog: list + detail without auth. */
exports.productRouter.get("/", productController.getProducts);
exports.productRouter.get("/:productId", productController.getProduct);
const protectedProductRouter = (0, express_1.Router)();
protectedProductRouter.use(authenticate_1.authenticate);
protectedProductRouter.use((0, authorize_1.authorizeRole)("ADMIN"));
protectedProductRouter.post("/", upload_1.upload.any(), productController.createProduct);
protectedProductRouter.post("/:productId/variants", variantController.createVariant);
protectedProductRouter.patch("/:productId", upload_1.upload.any(), productController.updateProduct);
exports.productRouter.use(protectedProductRouter);
//# sourceMappingURL=product.routes.js.map