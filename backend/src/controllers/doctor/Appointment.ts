import HTTP_statusCode from "../../enums/HTTPstatusCode";
import { IAppointmentService } from "../../interfaces/doctor/Appointment.service.interface";
import { Request, Response } from "express";


export class AppointmentController {

    private AppointmentService: IAppointmentService;

    constructor(AppointmentService: IAppointmentService) {
        this.AppointmentService = AppointmentService
    }

    async getAppointments(req: Request, res: Response): Promise<any> {
        const doctorId = req.params.doctorId;
        const page = parseInt(req.query.page as string) || 1; // Default to page 1
        const limit = parseInt(req.query.limit as string) || 10; // Default to 10 items per page
        const status = req.query.status as string

        try {
            const result = await this.AppointmentService.getAppointments(doctorId, page, limit, status);
            res.status(HTTP_statusCode.OK).json(result);
        } catch (error: any) {
            res
                .status(HTTP_statusCode.InternalServerError)
                .json({ message: "Error fetching appointments", error: error.message });
        }
    }

    async cancelAppointment(req: Request, res: Response): Promise<any> {
        try {
            const { appointmentId, reason } = req.body;
            const response = this.AppointmentService.cancelAppointment(
                appointmentId,
                reason
            );
            res
                .status(HTTP_statusCode.OK)
                .json({ message: "Appointment has been cancelled", data: response });
        } catch (error: any) {
            console.error(error);
            res
                .status(HTTP_statusCode.InternalServerError)
                .json({ success: false, message: "An unexpected error has occured" });
        }
    }

    async addPrescription(req: Request, res: Response): Promise<any> {
        try {
            const { appointmentId, prescription } = req.body;

            console.log("Received appointmentId:", appointmentId);
            console.log("Received prescription:", prescription);

            const response = await this.AppointmentService.addPrescription(
                appointmentId,
                prescription
            );

            console.log("Add Prescription Response:", response);

            res
                .status(HTTP_statusCode.OK)
                .json({ message: "Prescription added successfully", data: response });
        } catch (error: any) {
            console.error("Error adding prescription:", error.message);

            if (error.message.includes("Failed to add prescription")) {
                res
                    .status(HTTP_statusCode.BadRequest)
                    .json({ message: `Failed to add prescription: ${error.message}` });
            } else {
                res.status(HTTP_statusCode.InternalServerError).json({
                    message: "An unexpected error occurred",
                    error: error.message,
                });
            }
        }
    }

    async getMedicalRecords(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.userId;

            const response = await this.AppointmentService.getMedicalRecords(userId);

            res.status(HTTP_statusCode.OK).json({ message: "successfully", response });
        } catch (error: any) {
            if (
                error.message ===
                "Something went wrong while creating the specialization."
            ) {
                res.status(HTTP_statusCode.BadRequest).json({
                    message: "Something went wrong while creating the specialization.",
                });
            } else {
                res.status(HTTP_statusCode.InternalServerError).json({
                    message: "An unexpected error occurred",
                    error: error.message,
                });
            }
        }
    }

}