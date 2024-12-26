interface BaseNotification {
    _id: string;
    message: string;
    createdAt: Date;
    isRead: boolean;
    type: string;
}

export interface NotificationDocument {
    _id: string;
    receiverId: string;
    notifications: BaseNotification[];
}

interface AggregatedNotification extends BaseNotification {
    receiverId: string;
}

export interface INotificationRepository {
    findByUserId(userId: string): Promise<AggregatedNotification[]>;
    deleteNotification(id: string, notificationId: string): Promise<NotificationDocument | null>;
}