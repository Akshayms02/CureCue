import { NotificationRepository } from "../repositories/notificationRepository";

class NotificationService {
  private notificationRepository:NotificationRepository;

  constructor(notificationRepository: NotificationRepository) {
    this.notificationRepository = notificationRepository;
  }
  async getUnreadNotifications(userId: string): Promise<any> {
    return this.notificationRepository.findByUserId(userId);
  }
}

export { NotificationService };
