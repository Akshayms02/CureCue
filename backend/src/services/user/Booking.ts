import mongoose from "mongoose";
import { IBookingService } from "../../interfaces/user/Booking.service.interface";
import { IBookingRepository } from "../../interfaces/user/Booking.repository.interface";
import { IAppointment } from "../../models/appointmentModel";
import razorpay from "../../config/razorpay";


export class BookingService implements IBookingService {
    private BookingRepository: IBookingRepository;

    constructor(BookingRepository: IBookingRepository) {
        this.BookingRepository = BookingRepository
    }

    async createAppointment(data: any): Promise<IAppointment> {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const {
                doctorId,
                userId,
                paymentId,
                amount,
                date,
                patientName,
                timeslotId,
            } = data;
            const parseDate = new Date(date);
            console.log(data);

            // Call the repository to find a valid slot
            const slot = await this.BookingRepository.findAvailableSlot(
                doctorId,
                userId,
                timeslotId,
                new Date(date),
                session
            );
            console.log(slot);
            if (!slot) {
                throw new Error("No valid time slot found");
            }
            const timeSlot = slot.timeSlots.filter(
                (element: any) => element.start.toISOString() == timeslotId
            );

            await this.BookingRepository.bookSlot(slot, userId, session);

            const newAppointment = await this.BookingRepository.createAppointment(
                {
                    doctorId,
                    userId,
                    paymentId,
                    fees: amount,
                    start: timeSlot[0].start,
                    end: timeSlot[0].end,
                    date: parseDate,
                    patientName: patientName,
                },
                session
            );

            // Commit the transaction
            await session.commitTransaction();
            session.endSession();

            return newAppointment;
        } catch (error: any) {
            // Rollback transaction on error
            console.log(error);
            await session.abortTransaction();
            session.endSession();
            throw new Error("Failed to book appointment");
        }
    }

    async cancelAppointment(appointmentId: string): Promise<any> {
        try {
            const response = await this.BookingRepository.cancelAppointment(
                appointmentId
            );

            if (response) {
                const paymentId = response.paymentId;

                if (paymentId) {
                    const paymentDetails = await razorpay.payments.fetch(paymentId);
                    console.log("Payment Details:", paymentDetails);
                    const captureResponse = await razorpay.payments.capture(
                        paymentId,
                        response.fees * 100,
                        "INR"
                    );
                    console.log("Payment Captured:", captureResponse);
                    const refundOptions = {
                        amount: response.fees * 100,
                        speed: "normal",
                        notes: {
                            reason: "Appointment canceled",
                        },
                    };

                    // Call Razorpay's refund API
                    const refund = await razorpay.payments.refund(
                        paymentId,
                        refundOptions
                    );
                    console.log("refund was successful : ", refund);
                    return response;
                } else {
                    throw new Error("No payment ID available for refund");
                }
            }
        } catch (error: any) {
            console.error("Error in cancelAppointment:", error);
            throw new Error(`Failed to cancel appointment: ${error.message}`);
        }
    }
}