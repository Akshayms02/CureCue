import express from "express";
import NotificationController from "../controllers/notify/Notification";
import { NotificationService } from "../services/notify/Notification";
import { NotificationRepository } from "../repositories/notify/Notification";

const router = express.Router();

const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(notificationService);

router.get(
  "/getNotifications/:userId",
  notificationController.getNotifications.bind(notificationController)
);

router.post("/deleteNotification", notificationController.deleteNotification.bind(notificationController))

export default router;
