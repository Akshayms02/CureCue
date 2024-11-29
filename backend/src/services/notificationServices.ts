import { NotificationRepository } from "../repositories/notificationRepository";

class NotificationService {
  private notificationRepository: NotificationRepository;

  constructor(notificationRepository: NotificationRepository) {
    this.notificationRepository = notificationRepository;
  }
  async getUnreadNotifications(userId: string): Promise<any> {
    return this.notificationRepository.findByUserId(userId);
  }

  async deleteNotification(id: string, notificationId: string): Promise<any> {
    const response = await this.notificationRepository.deleteNotification(id as string, notificationId as string);
    return response
  }
}

export { NotificationService };
