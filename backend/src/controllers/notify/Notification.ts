import { Request, Response } from "express";
import { NotificationService } from "../../services/notify/Notification";

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
    async deleteNotification(req: Request, res: Response): Promise<void> {
        try {
            const { id, notificationId } = req.query
            const response = await this.notificationService.deleteNotification(id as string, notificationId as string)
            res.status(200).json(response)
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: "Failed to delete notification" })
        }
    }
}

export default NotificationController;
