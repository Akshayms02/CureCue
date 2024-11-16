import mongoose from "mongoose";

export interface NotificationData {
  userId: string;
  message: string;
  read?: boolean;
  appointmentId: string;
}

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  appointmentId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Notification = mongoose.model("Notification", notificationSchema);
