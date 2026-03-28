import type { Request, Response, NextFunction } from "express";
import * as notificationService from "./notification.service";
import {
  ListNotificationsQuerySchema,
  NotificationParamsSchema,
} from "./notification.schema";

export async function listNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.auth!.userId;
    const q = ListNotificationsQuerySchema.parse(req.query);
    const skip = q.skip ?? 0;
    const take = q.take ?? 50;
    const rows = await notificationService.listNotificationsForUser(userId, {
      skip,
      take,
    });
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
}

export async function markRead(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.auth!.userId;
    const params = NotificationParamsSchema.parse(req.params);
    const row = await notificationService.markNotificationRead(
      params.notificationId,
      userId,
    );
    res.status(200).json(row);
  } catch (err) {
    next(err);
  }
}
