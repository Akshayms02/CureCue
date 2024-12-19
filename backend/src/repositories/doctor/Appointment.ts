import mongoose from "mongoose";
import { IAppointmentRepository } from "../../interfaces/doctor/Appointment.repository.interface";
import appointmentModel from "../../models/appointmentModel";
import Slot from "../../models/doctorSlotsModel";
import NotificationModel from "../../models/notificationModel";
import { sendAppointmentCancellationNotification } from "../../config/socketConfig";
import walletModel, { ITransaction } from "../../models/walletModel";


export class AppointmentRepository implements IAppointmentRepository {
    async getMedicalRecords(userId: string): Promise<any> {
        try {
            const medicalRecords = await appointmentModel.find({
                userId: userId,
                prescription: { $ne: null },
            });

            return medicalRecords;
        } catch (error: any) {
            console.error("Error getting medical records:", error.message);
            throw new Error(
                `Failed to fetch medical records for user ${userId}: ${error.message}`
            );
        }
    }

    async cancelAppointment(appointmentId: string, reason: string): Promise<any> {
        try {
            const appointment = await appointmentModel.findOneAndUpdate(
                { _id: new mongoose.Types.ObjectId(appointmentId) },
                {
                    status: "cancelled by Doctor",
                    reason: reason,
                    paymentStatus: "refunded",
                },
                { new: true }
            );

            if (!appointment) {
                throw new Error(`Appointment with ID ${appointmentId} not found`);
            }

            if (appointment) {
                const slotUpdation = await Slot.findOne({
                    doctorId: appointment.doctorId,
                    date: appointment.date,
                });

                if (slotUpdation) {
                    const matchingSlot = slotUpdation.timeSlots.find(
                        (slot: any) =>
                            new Date(slot.start).getTime() ===
                            new Date(appointment.start as Date).getTime()
                    );

                    if (matchingSlot) {
                        matchingSlot.isBooked = false;
                        matchingSlot.isOnHold = false;
                        matchingSlot.heldBy = undefined;
                        matchingSlot.holdExpiresAt = undefined;

                        await slotUpdation.save();
                    }
                }

                const userNotificationContent = {
                    content: "Application was cancelled by the doctor",
                    type: "appointment cancellation",
                    read: false,
                    appointmentId: appointmentId,
                };
                const doctorNotificationContent = {
                    content: "Application cancellation successful",
                    type: "appointment cancellation",
                    read: false,
                    appointmentId: appointmentId,
                };

                await NotificationModel.findOneAndUpdate(
                    { receiverId: appointment.userId },
                    { $push: { notifications: userNotificationContent } },
                    { new: true, upsert: true }
                );
                await NotificationModel.findOneAndUpdate(
                    { receiverId: appointment.doctorId },
                    { $push: { notifications: doctorNotificationContent } },
                    { new: true, upsert: true }
                );

                sendAppointmentCancellationNotification(
                    appointment.doctorId,
                    appointment.userId
                );
            }
        } catch (error: any) {
            console.error("Error processing cancellation:", error.message);
            throw new Error(error.message);
        }
    }

    async completeAppointment(
        appointmentId: string,
        prescription: string
    ): Promise<any> {
        try {
            const appointment = await appointmentModel.findOneAndUpdate(
                { _id: appointmentId },
                { status: "completed", prescription: prescription },
                { new: true }
            );

            if (!appointment) {
                throw new Error("Appointment not found");
            }

            if (appointment.fees == null) {
                throw new Error("Appointment fees are not defined");
            }
            let wallet = await walletModel.findOne({
                doctorId: appointment.doctorId,
            });

            const transactionId =
                "txn_" + Date.now() + Math.floor(Math.random() * 10000);
            const transactionAmount = 0.9 * appointment?.fees;

            const transaction: ITransaction = {
                amount: transactionAmount,
                transactionId: transactionId,
                transactionType: "credit",
                appointmentId: appointmentId,
            };

            if (wallet) {
                wallet.transactions.push(transaction);
                wallet.balance += transactionAmount;
                await wallet.save();
            } else {
                wallet = new walletModel({
                    doctorId: appointment.doctorId,
                    balance: transactionAmount,
                    transactions: [transaction],
                });
                await wallet.save();
            }

            return appointment;
        } catch (error: any) {
            console.error("Error completing appointment:", error.message);
            throw new Error(error.message);
        }
    }
    async findAppointmentsByDoctor(
        doctorId: string,
        page: number,
        limit: number,
        status: string
    ): Promise<any> {
        try {
            const skip = (page - 1) * limit; // Calculate how many documents to skip
            const query: any = { doctorId: doctorId };
            console.log(status);
            if (status !== "All") {
                query.status = status;
            }

            const appointments = await appointmentModel
                .find(query)
                .sort({ date: -1 })
                .skip(skip)
                .limit(limit);

            const total = await appointmentModel.countDocuments(query);

            return { appointments, total };
        } catch (error: any) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }
}