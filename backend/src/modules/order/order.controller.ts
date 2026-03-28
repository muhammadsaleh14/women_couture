import type { Request, Response, NextFunction } from "express";
import * as orderService from "./order.service";
import type { CreateOrderBody, UpdateOrderBody } from "./order.schema";
import {
  ListOrdersQuerySchema,
  OrderParamsSchema,
} from "./order.schema";

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.body as CreateOrderBody;
    const userId = req.auth?.userId ?? null;
    const created = await orderService.createOrder({
      ...body,
      userId,
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

export async function listOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const q = ListOrdersQuerySchema.parse(req.query);
    const skip = q.skip ?? 0;
    const take = q.take ?? 50;
    const rows = await orderService.listOrders({ skip, take });
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
}

export async function getOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const params = OrderParamsSchema.parse(req.params);
    const row = await orderService.getOrderById(params.orderId);
    if (!row) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.status(200).json(row);
  } catch (err) {
    next(err);
  }
}

export async function updateOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const params = OrderParamsSchema.parse(req.params);
    const body = req.body as UpdateOrderBody;
    const row = await orderService.updateOrderStatus(params.orderId, body.status);
    res.status(200).json(row);
  } catch (err) {
    next(err);
  }
}
