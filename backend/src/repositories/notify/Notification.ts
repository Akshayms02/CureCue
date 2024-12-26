import { INotificationRepository } from "../../interfaces/notify/Notification.repository.interface";
import NotificationModel from "../../models/notificationModel";

class NotificationRepository implements INotificationRepository {
    async findByUserId(userId: string) {
        const notification = await NotificationModel.aggregate([
            { $match: { receiverId: userId } },
            { $unwind: "$notifications" },
            { $sort: { "notifications.createdAt": -1 } },
        ]);
        return notification;
    }

    async deleteNotification(id: string, notificationId: string): Promise<any> {

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
