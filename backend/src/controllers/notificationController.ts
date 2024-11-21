import { Request, Response } from "express";
import { NotificationService } from "../services/notificationServices";

class NotificationController {
  private notificationService: NotificationService;

  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService;
  }

  async getNotifications(req: Request, res: Response): Promise<void> {
    try {
      const userId: string = req.params.userId;
      const notifications =
        await this.notificationService.getUnreadNotifications(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  }
}

export default NotificationController;
