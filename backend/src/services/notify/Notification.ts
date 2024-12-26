import { INotificationService } from "../../interfaces/notify/Notification.service.interface";
import { NotificationRepository } from "../../repositories/notify/Notification";

class NotificationService implements INotificationService {
    private notificationRepository: NotificationRepository;

    constructor(notificationRepository: NotificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async getUnreadNotifications(userId: string) {
        return this.notificationRepository.findByUserId(userId);
    }

    async deleteNotification(id: string, notificationId: string) {
        const response = await this.notificationRepository.deleteNotification(id as string, notificationId as string);
        return response
    }
}

export { NotificationService };
