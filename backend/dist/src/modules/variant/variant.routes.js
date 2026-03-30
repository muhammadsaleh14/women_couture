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
exports.variantRouter = void 0;
const express_1 = require("express");
const variantController = __importStar(require("./variant.controller"));
const authenticate_1 = require("../../core/middleware/authenticate");
const authorize_1 = require("../../core/middleware/authorize");
const upload_1 = require("../../core/middleware/upload");
exports.variantRouter = (0, express_1.Router)();
exports.variantRouter.use(authenticate_1.authenticate);
exports.variantRouter.use((0, authorize_1.authorizeRole)("ADMIN"));
exports.variantRouter.get("/:variantId/stock-moves", variantController.listStockMoves);
exports.variantRouter.patch("/:variantId", variantController.updateVariant);
exports.variantRouter.delete("/:variantId", variantController.deleteVariant);
exports.variantRouter.post("/:variantId/stock", variantController.adjustStock);
exports.variantRouter.post("/:variantId/images", upload_1.upload.single("image"), variantController.uploadImage);
exports.variantRouter.delete("/images/:imageId", variantController.deleteImage);
//# sourceMappingURL=variant.routes.js.map