import NotificationModel from "../models/notificationModel";

class NotificationRepository {
  async findByUserId(userId: string): Promise<Notification[]> {
    const notification = await NotificationModel.aggregate([
      { $match: { receiverId: userId } },
      { $unwind: "$notifications" },
    ]);
    return notification;
  }
}

export { NotificationRepository };
