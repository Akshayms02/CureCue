import { Notification, NotificationData } from "../models/notificationModel";

class NotificationRepository {
  async create(notificationData: NotificationData): Promise<Notification> {
    const notification = new Notification(notificationData);
    return notification.save();
  }

  async findByUserId(
    userId: string,
    options: { read?: boolean } = { read: false }
  ): Promise<Notification[]> {
    return Notification.find({ userId, ...options });
  }

  async updateMany(filter: any, update: any): Promise<any> {
    return Notification.updateMany(filter, update);
  }
}

export { NotificationRepository };
