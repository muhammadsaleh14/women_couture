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
exports.orderRouter = void 0;
const express_1 = require("express");
const authenticate_1 = require("../../core/middleware/authenticate");
const authorize_1 = require("../../core/middleware/authorize");
const validate_1 = require("../../core/middleware/validate");
const orderController = __importStar(require("./order.controller"));
const order_schema_1 = require("./order.schema");
exports.orderRouter = (0, express_1.Router)();
exports.orderRouter.post("/", authenticate_1.optionalAuthenticate, (0, validate_1.validateBody)(order_schema_1.CreateOrderBodySchema), orderController.createOrder);
const adminOrderRouter = (0, express_1.Router)();
adminOrderRouter.use(authenticate_1.authenticate);
adminOrderRouter.use((0, authorize_1.authorizeRole)("ADMIN"));
adminOrderRouter.get("/", orderController.listOrders);
adminOrderRouter.get("/:orderId", orderController.getOrder);
adminOrderRouter.patch("/:orderId", (0, validate_1.validateBody)(order_schema_1.UpdateOrderBodySchema), orderController.updateOrder);
exports.orderRouter.use(adminOrderRouter);
//# sourceMappingURL=order.routes.js.map