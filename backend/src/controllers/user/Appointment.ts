import { Request, Response } from "express";
import { IAppointmentService } from "../../interfaces/user/Appointment.service.interface";
import HTTP_statusCode from "../../enums/HTTPstatusCode";


export class AppointmentController {
    private AppointmentService: IAppointmentService;

    constructor(AppointmentService: IAppointmentService) {
        this.AppointmentService = AppointmentService
    }

    async getSlots(req: Request, res: Response): Promise<void> {
        try {
            const { doctorId, date } = req.params;
            const response = await this.AppointmentService.getSlots(
                doctorId as string,
                date as string
            );
            if (response) {
                res.status(HTTP_statusCode.OK).json(response);
            }
        } catch (error: any) {
            if (error instanceof Error) {
                res.status(HTTP_statusCode.InternalServerError).json({ message: "Internal Server Error" });
            }
        }
    }

    async holdSlot(req: Request, res: Response): Promise<any> {
        const { doctorId, date, startTime, userId } = req.body;
        console.log(req.body);

        try {
            const checkHold = await this.AppointmentService.checkHold(
                doctorId,
                new Date(date),
                new Date(startTime)
            );
            if (checkHold) {
                console.log(checkHold);
                if (checkHold.length > 0) {
                    const timeslot = checkHold[0].timeSlots.filter((element: any) => {
                        return element.start.toISOString() == startTime;
                    });

                    if (timeslot[0].isOnHold == true) {
                        return res
                            .status(HTTP_statusCode.BadRequest)
                            .json({ success: false, message: "Failed to hold timeslot." });
                    }
                }
            }
            if (!userId) {
                throw new Error("Invalid User");
            }
            const result = await this.AppointmentService.holdSlot(
                doctorId,
                new Date(date),
                new Date(startTime),
                userId
            );
            console.log(result);

            if (result) {
                return res.status(HTTP_statusCode.OK).json({
                    success: true,
                    message: "Timeslot held successfully.",
                    result,
                });
            } else {
                console.log("hello");
                return res
                    .status(HTTP_statusCode.BadRequest)
                    .json({ success: false, message: "Failed to hold timeslot." });
            }
        } catch (error: any) {
            console.log(error);
            if (error.message == "Invalid User") {
                return res
                    .status(HTTP_statusCode.Unauthorized)
                    .json({ success: false, message: "Invalid User" });
            } else {
                return res.status(HTTP_statusCode.InternalServerError).json({
                    success: false,
                    message: "Error holding timeslot.",
                    error: error.message,
                });
            }
        }
    }




    async getAllAppointments(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.userId;
            const { status, page = 1, limit = 5 } = req.query;

            const { appointments, totalPages } =
                await this.AppointmentService.getAppointments(
                    userId,
                    status as string,
                    parseInt(page as string),
                    parseInt(limit as string)
                );

            res.status(HTTP_statusCode.OK).json({
                message: "Appointments fetched successfully",
                data: appointments,
                totalPages,
            });
        } catch (error: any) {
            console.error("Error fetching appointments:", error.message);

            if (error.message.includes("Failed to get appointments")) {
                res
                    .status(HTTP_statusCode.BadRequest)
                    .json({ message: `Failed to get appointments: ${error.message}` });
            } else {
                res.status(HTTP_statusCode.InternalServerError).json({
                    message: "An unexpected error occurred",
                    error: error.message,
                });
            }
        }
    }
    async addReview(req: Request, res: Response): Promise<void> {
        try {
            const { appointmentId, rating, reviewText } = req.body;

            const response = await this.AppointmentService.addReview(
                appointmentId,
                rating,
                reviewText
            );

            res
                .status(HTTP_statusCode.OK)
                .json({ message: "Review added successfully", data: response });
        } catch (error: any) {
            console.error("Error adding review:", error.message);

            if (error.message.includes("Failed to add review")) {
                res
                    .status(HTTP_statusCode.BadRequest)
                    .json({ message: `Failed to add review: ${error.message}` });
            } else {
                res.status(HTTP_statusCode.InternalServerError).json({
                    message: "An unexpected error occurred",
                    error: error.message,
                });
            }
        }
    }

    async getAppointment(req: Request, res: Response): Promise<void> {
        try {
            const appointmentId = req.params.appointmentId;

            const response = await this.AppointmentService.getAppointment(appointmentId);

            res
                .status(HTTP_statusCode.OK)
                .json({ message: "Appointment fetched successfully", data: response });
        } catch (error: any) {
            console.error(
                `Error fetching appointment with ID ${req.params.appointmentId}:`,
                error.message
            );

            if (error.message.includes("Failed to get appointments")) {
                res
                    .status(HTTP_statusCode.BadRequest)
                    .json({ message: `Failed to get appointments: ${error.message}` });
            } else {
                res.status(HTTP_statusCode.InternalServerError).json({
                    message: "An unexpected error occurred",
                    error: error.message,
                });
            }
        }
    }


}