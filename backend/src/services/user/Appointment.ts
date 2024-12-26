import { IAppointmentRepository } from "../../interfaces/user/Appointment.repository.interface";
import { IAppointmentService } from "../../interfaces/user/Appointment.service.interface";
import { IAppointment } from "../../models/appointmentModel";


export class AppointmentService implements IAppointmentService {
    private AppointmentRepository: IAppointmentRepository;

    constructor(AppointmentRepository: IAppointmentRepository) {
        this.AppointmentRepository = AppointmentRepository
    }

    async getSlots(
        doctorId: string,
        date: string
    ): Promise<{ start: Date; end: Date; isAvailable: boolean }[]> {
        try {
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
                throw new Error("Invalid date format");
            }

            const response = await this.AppointmentRepository.getSlots(doctorId, parsedDate)

            if (!response) {
                throw new Error("No response received from the repository");
            }

            return response;
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Unknown error occurred";
            throw new Error(errorMessage);
        }
    }


    async holdSlot(
        doctorId: string,
        date: Date,
        startTime: Date,
        userId: string,
        holdDurationMinutes: number = 5
    ): Promise<{ success: boolean; message: string }> {


        return await this.AppointmentRepository.holdSlot(
            doctorId,
            date,
            startTime,
            userId,
            holdDurationMinutes
        );
    }
    async checkHold(
        doctorId: string,
        date: Date,
        startTime: Date
    ): Promise<
        {
            slotId: string;
            userId: string;
            isOnHold: boolean;
            timeSlots: [{ start: Date; end: Date; isOnHold: boolean }];
        }[]
    > {
        return await this.AppointmentRepository.checkHold(doctorId, date, startTime);
    }


    async getAppointments(
        userId: string,
        status: string,
        page: number,
        limit: number
    ) {
        try {
            const response = await this.AppointmentRepository.getAllAppointments(
                userId,
                status,
                page,
                limit
            );

            if (response.appointments) {
                return response;
            } else {
                console.error("Failed to get appointments: Response is invalid");
                throw new Error(
                    "Something went wrong while fetching the appointments."
                );
            }
        } catch (error: any) {
            console.error("Error in getAppointments:", error.message);
            throw new Error(`Failed to get appointments: ${error.message}`);
        }
    }
    async addReview(
        appointmentId: string,
        rating: number,
        review: string
    ): Promise<IAppointment> {
        try {
            const response = await this.AppointmentRepository.addReview(
                appointmentId,
                rating,
                review
            );

            if (!response) {
                throw new Error("Appointment not found or review could not be added");
            }

            return response;
        } catch (error: any) {
            console.error("Error in addReview:", error.message);

            throw new Error(`Failed to add review: ${error.message}`);
        }
    }

    async getAppointment(appointmentId: string): Promise<any> {
        try {
            const response = await this.AppointmentRepository.getAppointment(appointmentId);

            if (response) {


                const updatedAppointment = {
                    ...response,
                    start: new Date(response.start as Date),
                    end: new Date(response.end as Date),
                };



                return updatedAppointment;
            } else {
                console.error("Failed to get appointment: Response is invalid");
                throw new Error("Something went wrong while fetching the appointment.");
            }
        } catch (error: any) {
            console.error("Error in getAppointment:", error.message);
            throw new Error(`Failed to get appointment: ${error.message}`);
        }
    }
}