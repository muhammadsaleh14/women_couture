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
exports.createProduct = createProduct;
exports.getProducts = getProducts;
exports.createVariant = createVariant;
exports.adjustStock = adjustStock;
exports.uploadImage = uploadImage;
const productService = __importStar(require("../services/product.service"));
const product_schema_1 = require("../schemas/product.schema");
async function createProduct(req, res, next) {
    try {
        const body = product_schema_1.CreateProductBodySchema.parse(req.body);
        const result = await productService.createProduct(body);
        res.status(201).json(result);
    }
    catch (err) {
        next(err);
    }
}
async function getProducts(req, res, next) {
    try {
        const query = product_schema_1.ProductQuerySchema.parse(req.query);
        // Transform 'true'/'false' strings to boolean for the service
        const isActive = query.isActive === "true" ? true : query.isActive === "false" ? false : undefined;
        const products = await productService.getAllProducts({
            skip: query.skip,
            take: query.take,
            isActive,
        });
        res.json(products);
    }
    catch (err) {
        next(err);
    }
}
async function createVariant(req, res, next) {
    try {
        const params = product_schema_1.ProductParamsSchema.parse(req.params);
        const body = product_schema_1.CreateVariantBodySchema.parse(req.body);
        const result = await productService.createVariant(params.productId, body);
        res.status(201).json(result);
    }
    catch (err) {
        if (err instanceof Error && (err.message === "Product not found" || err.message.includes("already exists"))) {
            res.status(400).json({ message: err.message });
            return;
        }
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
        const file = req.file; // From multer
        if (!file) {
            res.status(400).json({ message: "No image file provided" });
            return;
        }
        // Convert file path into a workable URL (e.g. replacing backslashes and prefixing)
        const normalizedPath = file.path.replace(/\\/g, "/");
        const url = `/${normalizedPath}`;
        const result = await productService.addImage(params.variantId, url);
        res.status(201).json(result);
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=product.controller.js.map