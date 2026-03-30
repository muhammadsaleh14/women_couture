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
exports.createOrder = createOrder;
exports.listOrders = listOrders;
exports.getOrder = getOrder;
exports.updateOrder = updateOrder;
const orderService = __importStar(require("./order.service"));
const order_schema_1 = require("./order.schema");
async function createOrder(req, res, next) {
    try {
        const body = req.body;
        const userId = req.auth?.userId ?? null;
        const created = await orderService.createOrder({
            ...body,
            userId,
        });
        res.status(201).json(created);
    }
    catch (err) {
        next(err);
    }
}
async function listOrders(req, res, next) {
    try {
        const q = order_schema_1.ListOrdersQuerySchema.parse(req.query);
        const skip = q.skip ?? 0;
        const take = q.take ?? 50;
        const rows = await orderService.listOrders({ skip, take });
        res.status(200).json(rows);
    }
    catch (err) {
        next(err);
    }
}
async function getOrder(req, res, next) {
    try {
        const params = order_schema_1.OrderParamsSchema.parse(req.params);
        const row = await orderService.getOrderById(params.orderId);
        if (!row) {
            res.status(404).json({ message: "Order not found" });
            return;
        }
        res.status(200).json(row);
    }
    catch (err) {
        next(err);
    }
}
async function updateOrder(req, res, next) {
    try {
        const params = order_schema_1.OrderParamsSchema.parse(req.params);
        const body = req.body;
        const row = await orderService.updateOrderStatus(params.orderId, body.status);
        res.status(200).json(row);
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=order.controller.js.map