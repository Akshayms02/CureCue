import mongoose from "mongoose";
import { IAppointmentRepository } from "../../interfaces/user/Appointment.repository.interface";
import appointmentModel from "../../models/appointmentModel";
import doctorModel from "../../models/doctorModel";
import Slot from "../../models/doctorSlotsModel";
import NotificationModel from "../../models/notificationModel";
import { sendAppointmentCancellationNotification } from "../../config/socketConfig";


export class AppointmentRepository implements IAppointmentRepository {
    async checkHold(doctorId: string, date: Date, startTime: Date): Promise<any> {
        date.setUTCHours(0, 0, 0, 0);
        const convertedDate = date.toISOString().replace("Z", "+00:00");
        const convertedDateString = startTime.toISOString().replace("Z", "+00:00");
        console.log(convertedDate, convertedDateString);
        return await Slot.find({
            doctorId,
            date: convertedDate,
            "timeSlots.start": convertedDateString,
        }).lean();
    }
    async getAllAppointments(
        userId: string,
        status: string,
        page: number,
        limit: number
    ) {
        try {
            const query: any = { userId: userId };
            console.log(status);
            if (status[0] !== "All") {
                query.status = status[0];
            }

            const skip = (page - 1) * limit;

            const appointments = await appointmentModel
                .find(query)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean();

            const totalAppointments = await appointmentModel.countDocuments(query);

            const totalPages = Math.ceil(totalAppointments / limit);

            const populatedAppointments = await Promise.all(
                appointments.map(async (appointment) => {
                    const doctor = await doctorModel
                        .findOne({ doctorId: appointment.doctorId }, { password: 0 })
                        .lean();
                    return { ...appointment, doctor };
                })
            );

            return { appointments: populatedAppointments, totalPages };
        } catch (error: any) {
            console.error("Error getting appointments:", error.message);
            throw new Error(error.message);
        }
    }
    async cancelAppointment(appointmentId: string): Promise<any> {
        try {
            console.log(appointmentId);
            const appointment = await appointmentModel.findOneAndUpdate(
                { _id: new mongoose.Types.ObjectId(appointmentId) },
                { status: "cancelled", paymentStatus: "refunded" },
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
                    content: "Your Appointment cancelled successfully",
                    type: "appointment cancellation", // Assume "message" type for chat notifications; adjust as needed
                    read: false,
                    appointmentId: appointmentId,
                };
                const doctorNotificationContent = {
                    content: "Appointment has been cancelled by patient",
                    type: "appointment cancellation", // Assume "message" type for chat notifications; adjust as needed
                    read: false,
                    appointmentId: appointmentId,
                };

                // Find the receiver's notification document, or create a new one if it doesn't exist
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

            return appointment;
        } catch (error: any) {
            console.error("Error canceling appointment:", error.message);
            throw new Error(error.message);
        }
    }
    async addReview(
        appointmentId: string,
        rating: number,
        reviewText: string
    ): Promise<any> {
        try {
            const updatedAppointment = await appointmentModel.findOneAndUpdate(
                { _id: appointmentId },
                {
                    $set: {
                        "review.rating": rating,
                        "review.description": reviewText,
                    },
                },
                { new: true }
            );

            if (!updatedAppointment) {
                throw new Error("Appointment not found");
            }

            return updatedAppointment;
        } catch (error: any) {
            console.error("Error adding review:", error.message);
            throw new Error(error.message);
        }
    }
    async getAppointment(appointmentId: string): Promise<any> {
        try {
            const appointment = await appointmentModel.findById(appointmentId).lean();

            if (!appointment) {
                throw new Error(`Appointment with ID ${appointmentId} not found`);
            }

            const doctor = await doctorModel
                .findOne({ doctorId: appointment.doctorId }, { password: 0 })
                .lean();

            return { ...appointment, doctor };
        } catch (error: any) {
            console.error("Error getting appointment:", error.message);
            throw new Error(error.message);
        }
    }

    async getSlots(doctorId: string, date: Date): Promise<any> {
        try {
            console.log(date);
            const response = await Slot.findOne({
                doctorId: doctorId,
                date: date,
                "timeSlots.end": { $gte: new Date() },
            }).lean();
            if (response) {
                console.log(response);
                return response.timeSlots.filter(
                    (slot) => new Date(slot.end) >= new Date()
                );
            } else {
                return [];
            }
        } catch (error: any) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }
    async holdSlot(
        doctorId: string,
        date: Date,
        startTime: Date,
        userId: string,
        holdDurationMinutes: number = 5
    ): Promise<any> {
        console.log(date, startTime);
        date.setUTCHours(0, 0, 0, 0);
        const convertedDate = date.toISOString().replace("Z", "+00:00");
        const convertedDateString = startTime.toISOString().replace("Z", "+00:00");
        const holdExpiresAt = new Date();
        holdExpiresAt.setMinutes(holdExpiresAt.getMinutes() + holdDurationMinutes);
        console.log(convertedDate, convertedDateString);
        console.log(
            doctorId,
            " ",
            convertedDate,
            " ",
            userId,
            " ",
            convertedDateString
        );
        return await Slot.findOneAndUpdate(
            {
                doctorId,
                date: convertedDate,
                "timeSlots.start": convertedDateString,
                "timeSlots.isBooked": false,
                "timeSlots.isOnHold": false,
            },
            {
                $set: {
                    "timeSlots.$.isOnHold": true,
                    "timeSlots.$.heldBy": userId,
                    "timeSlots.$.holdExpiresAt": holdExpiresAt,
                },
            },
            { new: true }
        ).lean();
    }
}