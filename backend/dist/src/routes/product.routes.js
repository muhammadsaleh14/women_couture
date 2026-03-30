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
exports.variantRouter = exports.productRouter = void 0;
const express_1 = require("express");
const productController = __importStar(require("../controllers/product.controller"));
const authenticate_1 = require("../middleware/authenticate");
const authorize_1 = require("../middleware/authorize");
const upload_1 = require("../middleware/upload");
exports.productRouter = (0, express_1.Router)();
// Base Product endpoints
// All product routes will require authentication AND Admin role
exports.productRouter.use(authenticate_1.authenticate);
exports.productRouter.use((0, authorize_1.authorizeRole)("ADMIN"));
// List products
exports.productRouter.get("/", productController.getProducts);
// Create a new base product
exports.productRouter.post("/", productController.createProduct);
// Add a variant to a product
exports.productRouter.post("/:productId/variants", productController.createVariant);
// ---------------------------------------------------------
// Below we have endpoints specific to a VARIANT
// We could put these in a separate variant.routes.ts, or keep them here for cohesion
// ---------------------------------------------------------
exports.variantRouter = (0, express_1.Router)();
exports.variantRouter.use(authenticate_1.authenticate);
exports.variantRouter.use((0, authorize_1.authorizeRole)("ADMIN"));
// Adjust stock
exports.variantRouter.post("/:variantId/stock", productController.adjustStock);
// Add an image to a variant
// We expect a single file in 'image' field inside multipart/form-data
exports.variantRouter.post("/:variantId/images", upload_1.upload.single("image"), productController.uploadImage);
//# sourceMappingURL=product.routes.js.map