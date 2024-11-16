import { NotificationRepository } from "../repositories/notificationRepository";

class NotificationService {
  async createAppointmentCancellationNotification(appointmentData: {
    patientId: string;
    time: string;
    appointmentId: string;
  }): Promise<void> {
    const { patientId, time, appointmentId } = appointmentData;
    const message = `Appointment ${appointmentId} on ${time} cancelled.`;

    try {
      await NotificationRepository.create({
        userId: patientId,
        message,
        appointmentId,
      });
    } catch (error) {
      console.error("Error creating notification:", error);
      throw new Error("Failed to create notification");
    }
  }

  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    return NotificationRepository.findByUserId(userId);
  }

  async markNotificationsAsRead(
    userId: string,
    notificationIds: string[]
  ): Promise<any> {
    return NotificationRepository.updateMany(
      { userId, _id: { $in: notificationIds } },
      { read: true }
    );
  }
}

export { NotificationService };
