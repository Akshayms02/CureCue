import mongoose from "mongoose";
import { IBookingRepository } from "../../interfaces/user/Booking.repository.interface";
import appointmentModel from "../../models/appointmentModel";
import doctorModel from "../../models/doctorModel";
import { sendAppointmentCancellationNotification } from "../../config/socketConfig";
import NotificationModel from "../../models/notificationModel";
import Slot from "../../models/doctorSlotsModel";


export class BookingRepository implements IBookingRepository {
    async createAppointment(data: any, session: mongoose.ClientSession) {
        const {
            doctorId,
            userId,
            paymentId,
            fees,
            currency,
            start,
            end,
            patientName,
            date,
        } = data;

        const appointment = new appointmentModel({
            doctorId: doctorId,
            userId: userId,
            start: start,
            end: end,
            paymentId: paymentId,
            fees: fees,
            currency,
            paymentStatus: "payment completed",
            patientName: patientName,
            date: date,
        });

        await appointment.save({ session });
        return appointment;
    }

    async bookSlot(
        slot: any,
        userId: string,
        session: mongoose.ClientSession
    ): Promise<any> {
        const timeSlot = slot.timeSlots.find(
            (ts: any) => ts.heldBy === userId && ts.isOnHold === true
        );
        if (!timeSlot) {
            throw new Error("The time slot is no longer available");
        }

        // Mark as booked
        timeSlot.isBooked = true;
        timeSlot.isOnHold = false;

        // Save the slot within the transaction
        await slot.save({ session });
    }

    async getDoctorReview(doctorId: string) {
        try {
            const isReviewDataPresent = true;

            const doctor = await doctorModel.aggregate([
                {
                    $match: { doctorId: doctorId }, // Match the doctor by doctorId
                },
                {
                    $lookup: {
                        from: "appointments",
                        let: { doctorId: "$doctorId" }, // Pass the doctorId to the next stage
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$doctorId", "$$doctorId"], // Match doctorId in both collections
                                    },
                                },
                            },
                            {
                                $project: {
                                    patientName: 1,
                                    review: 1,
                                    prescription: 1,
                                    date: 1,
                                    start: 1,
                                    end: 1,
                                    status: 1,
                                }, // Only include necessary fields
                            },
                        ],
                        as: "appointments",
                    },
                },
                {
                    $project: {
                        name: 1,
                        _id: 1,
                        doctorId: 1,
                        email: 1,
                        department: 1,
                        fees: 1,
                        image: 1,
                        appointments: {
                            $cond: [
                                { $eq: [isReviewDataPresent, true] }, // Check if review filtering is needed
                                {
                                    $map: {
                                        input: {
                                            $filter: {
                                                input: "$appointments", // Filter appointments based on review.rating
                                                as: "appointment",
                                                cond: {
                                                    $gt: [
                                                        { $ifNull: ["$$appointment.review.rating", 0] }, // Default rating to 0 if null
                                                        0,
                                                    ],
                                                },
                                            },
                                        },
                                        as: "appointment",
                                        in: {
                                            review: "$$appointment.review",
                                            patientName: "$$appointment.patientName",
                                        },
                                    },
                                },
                                [], // If no review data is present, return an empty array
                            ],
                        },
                    },
                },
            ]);

            if (doctor.length === 0) {
                return null;
            }

            return doctor[0];
        } catch (error: any) {
            console.error("Error getting doctor:", error.message);
            throw new Error(`Failed to fetch doctor ${doctorId}: ${error.message}`);
        }
    }

    async cancelAppointment(appointmentId: string): Promise<any> {
        try {

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

    async findAvailableSlot(
        doctorId: string,
        userId: string,
        start: string,
        date: Date,
        session: mongoose.ClientSession
    ): Promise<any> {
        date.setUTCHours(0, 0, 0, 0);
        const convertedDate = date.toISOString().replace("Z", "+00:00");
        const slot = await Slot.findOne({
            doctorId,
            date: convertedDate,
            "timeSlots.start": start,
            "timeSlots.isBooked": false,
            "timeSlots.isOnHold": true,
            "timeSlots.heldBy": userId,
        }).session(session); // Include session for transaction
        return slot;
    }
}