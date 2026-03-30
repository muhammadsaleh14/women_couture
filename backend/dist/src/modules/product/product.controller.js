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
exports.createProduct = createProduct;
exports.getProducts = getProducts;
exports.getProduct = getProduct;
exports.updateProduct = updateProduct;
const path_1 = __importDefault(require("path"));
const productService = __importStar(require("./product.service"));
const product_schema_1 = require("./product.schema");
function variantFilesToRelativeUrls(filesByVariant) {
    const variantImages = new Map();
    for (const [idx, files] of filesByVariant) {
        variantImages.set(idx, files.map((f) => "/" + path_1.default.relative(process.cwd(), f.path).replace(/\\/g, "/")));
    }
    return variantImages;
}
function parseMultipartBody(req) {
    if (req.is("application/json")) {
        return { data: req.body, filesByVariant: new Map() };
    }
    const raw = req.body?.data;
    const data = typeof raw === "string" ? JSON.parse(raw) : raw || {};
    const filesByVariant = new Map();
    const files = req.files || [];
    for (const file of files) {
        const match = file.fieldname.match(/^variants\[(\d+)\]$/);
        if (match) {
            const idx = parseInt(match[1], 10);
            if (!filesByVariant.has(idx))
                filesByVariant.set(idx, []);
            filesByVariant.get(idx).push(file);
        }
    }
    return { data, filesByVariant };
}
async function createProduct(req, res, next) {
    try {
        const { data, filesByVariant } = parseMultipartBody(req);
        const variantImages = variantFilesToRelativeUrls(filesByVariant);
        if (req.is("application/json")) {
            const body = product_schema_1.CreateProductBodySchema.parse(data);
            const result = await productService.createProduct(body, undefined);
            res.status(201).json(result);
            return;
        }
        const body = product_schema_1.SaveProductBodySchema.parse(data);
        const result = await productService.createProduct({
            name: body.name,
            description: body.description,
            type: body.type,
            variants: body.variants.map((v) => ({
                sku: v.sku ?? undefined,
                salePrice: v.salePrice,
                purchasePrice: v.purchasePrice ?? undefined,
            })),
        }, variantImages);
        res.status(201).json(result);
    }
    catch (err) {
        next(err);
    }
}
async function getProducts(req, res, next) {
    try {
        const query = product_schema_1.ProductQuerySchema.parse(req.query);
        const isActive = query.isActive === "true" ? true : query.isActive === "false" ? false : undefined;
        const result = await productService.getAllProducts({
            skip: query.skip,
            take: query.take,
            isActive,
        });
        res.json(result);
    }
    catch (err) {
        next(err);
    }
}
async function getProduct(req, res, next) {
    try {
        const params = product_schema_1.ProductParamsSchema.parse(req.params);
        const product = await productService.getProductById(params.productId);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.json(product);
    }
    catch (err) {
        next(err);
    }
}
async function updateProduct(req, res, next) {
    try {
        const params = product_schema_1.ProductParamsSchema.parse(req.params);
        const { data, filesByVariant } = parseMultipartBody(req);
        const variantImages = variantFilesToRelativeUrls(filesByVariant);
        if (req.is("application/json")) {
            const body = product_schema_1.UpdateProductBodySchema.parse(data);
            const result = await productService.updateProduct(params.productId, body);
            const full = await productService.getProductById(params.productId);
            res.status(200).json(full || result);
            return;
        }
        const body = product_schema_1.SaveProductBodySchema.parse(data);
        const full = await productService.replaceProductFull(params.productId, body, variantImages);
        res.status(200).json(full);
    }
    catch (err) {
        if (err instanceof Error && err.message.includes("Record to update not found")) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        next(err);
    }
}
//# sourceMappingURL=product.controller.js.map