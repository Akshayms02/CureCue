import { Request, Response } from "express";
import { IBookingService } from "../../interfaces/user/Booking.service.interface";


export class BookingController {
    private BookingService: IBookingService;

    constructor(BookingService: IBookingService) {
        this.BookingService = BookingService
    }

    async createAppointment(req: Request, res: Response): Promise<any> {
        try {
            const {
                amount,
                currency,
                email,
                doctorId,
                userId,
                paymentId,
                orderId,
                date,
                patientName,
                timeslotId,
            } = req.body;
            const appointment = await this.BookingService.createAppointment({
                amount,
                currency,
                email,
                doctorId,
                userId,
                paymentId,
                orderId,
                date,
                patientName,
                timeslotId,
            });

            return res.status(201).json({
                message: "Appointment created successfully",
                appointment,
            });
        } catch (error: any) {
            return res.status(500).json({
                message: "Failed to create appointment",
                error: error.message,
            });
        }
    }

    async cancelAppointment(req: Request, res: Response): Promise<void> {
        try {
            const appointmentId = req.params.appointmentId;

            const response = await this.BookingService.cancelAppointment(appointmentId);

            res
                .status(200)
                .json({
                    message: "Appointment cancelled successfully",
                    data: response,
                });
        } catch (error: any) {
            console.error("Error canceling appointment:", error.message);

            if (error.message.includes("Failed to cancel appointment")) {
                res
                    .status(400)
                    .json({ message: `Failed to cancel appointment: ${error.message}` });
            } else {
                res.status(500).json({
                    message: "An unexpected error occurred",
                    error: error.message,
                });
            }
        }
    }
}