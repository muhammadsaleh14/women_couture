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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVariant = createVariant;
exports.updateVariant = updateVariant;
exports.deleteVariant = deleteVariant;
exports.listStockMoves = listStockMoves;
exports.adjustStock = adjustStock;
exports.uploadImage = uploadImage;
exports.deleteImage = deleteImage;
const path_1 = __importDefault(require("path"));
const variantService = __importStar(require("./variant.service"));
const product_schema_1 = require("../product/product.schema");
const variant_schema_1 = require("./variant.schema");
const productService = __importStar(require("../product/product.service"));
async function createVariant(req, res, next) {
    try {
        const params = product_schema_1.ProductParamsSchema.parse(req.params);
        const body = product_schema_1.CreateVariantBodySchema.parse(req.body);
        const result = await variantService.createVariant(params.productId, body);
        res.status(201).json(result);
    }
    catch (err) {
        if (err instanceof Error &&
            (err.message === "Product not found" || err.message.includes("already exists"))) {
            res.status(400).json({ message: err.message });
            return;
        }
        next(err);
    }
}
async function updateVariant(req, res, next) {
    try {
        const params = product_schema_1.ProductVariantParamsSchema.parse(req.params);
        const body = variant_schema_1.UpdateVariantBodySchema.parse(req.body);
        const result = await variantService.updateVariant(params.variantId, body);
        res.status(200).json(result);
    }
    catch (err) {
        if (err instanceof Error && err.message.includes("Record to update not found")) {
            res.status(404).json({ message: "Variant not found" });
            return;
        }
        next(err);
    }
}
async function deleteVariant(req, res, next) {
    try {
        const params = product_schema_1.ProductVariantParamsSchema.parse(req.params);
        await variantService.deleteVariant(params.variantId);
        res.status(204).send();
    }
    catch (err) {
        if (err instanceof Error && err.message === "Variant not found") {
            res.status(404).json({ message: "Variant not found" });
            return;
        }
        next(err);
    }
}
async function listStockMoves(req, res, next) {
    try {
        const params = product_schema_1.ProductVariantParamsSchema.parse(req.params);
        const result = await variantService.listStockMovesForVariant(params.variantId);
        if (!result) {
            res.status(404).json({ message: "Variant not found" });
            return;
        }
        res.json(result);
    }
    catch (err) {
        next(err);
    }
}
async function adjustStock(req, res, next) {
    try {
        const params = product_schema_1.ProductVariantParamsSchema.parse(req.params);
        const body = product_schema_1.AdjustStockBodySchema.parse(req.body);
        const result = await productService.adjustStock(params.variantId, body.type, body.quantity, body.notes);
        res.status(200).json(result);
    }
    catch (err) {
        if (err instanceof Error && err.message.includes("Insufficient stock")) {
            res.status(400).json({ message: err.message });
            return;
        }
        next(err);
    }
}
async function uploadImage(req, res, next) {
    try {
        const params = product_schema_1.ProductVariantParamsSchema.parse(req.params);
        const file = req.file;
        if (!file) {
            res.status(400).json({ message: "No image file provided" });
            return;
        }
        const url = "/" + path_1.default.relative(process.cwd(), file.path).replace(/\\/g, "/");
        const result = await variantService.addImage(params.variantId, url);
        res.status(201).json(result);
    }
    catch (err) {
        next(err);
    }
}
async function deleteImage(req, res, next) {
    try {
        const imageId = req.params.imageId;
        await variantService.deleteImage(imageId);
        res.status(204).send();
    }
    catch (err) {
        if (err instanceof Error && err.message.includes("Record to delete does not exist")) {
            res.status(404).json({ message: "Image not found" });
            return;
        }
        next(err);
    }
}
//# sourceMappingURL=variant.controller.js.map