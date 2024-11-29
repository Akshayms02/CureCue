import NotificationModel from "../models/notificationModel";

class NotificationRepository {
  async findByUserId(userId: string): Promise<Notification[]> {
    const notification = await NotificationModel.aggregate([
      { $match: { receiverId: userId } },
      { $unwind: "$notifications" },
    ]);
    return notification;
  }

  async deleteNotification(id: string, notificationId: string): Promise<any> {
    console.log(id, notificationId)
    const result = await NotificationModel.findByIdAndUpdate(
      id,
      {
        $pull: { notifications: { _id: notificationId } },
      },
      { new: true }
    );
    return result
  }
}

export { NotificationRepository };
