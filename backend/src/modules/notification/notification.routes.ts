import { Router } from "express";
import { authenticate } from "../../core/middleware/authenticate";
import { authorizeRole } from "../../core/middleware/authorize";
import * as notificationController from "./notification.controller";

export const notificationRouter = Router();

notificationRouter.use(authenticate);
notificationRouter.use(authorizeRole("ADMIN"));

notificationRouter.get("/", notificationController.listNotifications);
notificationRouter.patch(
  "/:notificationId/read",
  notificationController.markRead,
);
