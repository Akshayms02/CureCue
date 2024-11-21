import express from "express";
import NotificationController from "../controllers/notificationController";
import { NotificationService } from "../services/notificationServices";
import { NotificationRepository } from "../repositories/notificationRepository";

const router = express.Router();

const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(notificationService);

router.get(
  "/getNotifications/:userId",
  notificationController.getNotifications.bind(notificationController)
);

export default router;
