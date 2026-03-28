import { Router } from "express";
import { authenticate, optionalAuthenticate } from "../../core/middleware/authenticate";
import { authorizeRole } from "../../core/middleware/authorize";
import { validateBody } from "../../core/middleware/validate";
import * as orderController from "./order.controller";
import { CreateOrderBodySchema, UpdateOrderBodySchema } from "./order.schema";

export const orderRouter = Router();

orderRouter.post(
  "/",
  optionalAuthenticate,
  validateBody(CreateOrderBodySchema),
  orderController.createOrder,
);

const adminOrderRouter = Router();
adminOrderRouter.use(authenticate);
adminOrderRouter.use(authorizeRole("ADMIN"));
adminOrderRouter.get("/", orderController.listOrders);
adminOrderRouter.get("/:orderId", orderController.getOrder);
adminOrderRouter.patch(
  "/:orderId",
  validateBody(UpdateOrderBodySchema),
  orderController.updateOrder,
);

orderRouter.use(adminOrderRouter);
