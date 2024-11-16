import express from 'express';
import NotificationController from '../controllers/notificationController';
import { NotificationService } from '../services/notificationServices';

const router = express.Router();

// Dependency injection
const notificationService = new NotificationService();
const notificationController = new NotificationController(notificationService);

router.get('/notifications', (req, res) => notificationController.getNotifications(req, res));
router.put('/notifications/:id/read', (req, res) => notificationController.markNotificationsAsRead(req, res));

export default router;