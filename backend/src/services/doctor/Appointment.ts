import { IAppointmentRepository } from "../../interfaces/doctor/Appointment.repository.interface";
import { IAppointmentService } from "../../interfaces/doctor/Appointment.service.interface";
import { IAppointmentWithDetails } from "../../interfaces/doctor/Appointment.repository.interface";


export class AppointmentService implements IAppointmentService {
    private AppointmentRepository: IAppointmentRepository;

    constructor(AppointmentRepository: IAppointmentRepository) {
        this.AppointmentRepository = AppointmentRepository
    }

    private getFolderPathByFileType(fileType: string): string {
        switch (fileType) {
            case "profile image":
                return "cureCue/doctorProfileImages";
            case "document":
                return "cureCue/doctorDocuments";

            default:
                throw new Error(`Unknown file type: ${fileType}`);
        }
    }


    async getAppointments(
        doctorId: string,
        page: number,
        limit: number,
        status: string
    ): Promise<any> {
        try {
            const { appointments, total } =
                await this.AppointmentRepository.findAppointmentsByDoctor(
                    doctorId,
                    page,
                    limit,
                    status
                );

            return {
                appointments,
                total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
            };
        } catch (error: any) {
            console.error(error)
            throw new Error("Error fetching appointments from service");
        }
    }

    async cancelAppointment(
        appointmentId: string,
        reason: string
    ): Promise<void> {
        try {
            const response = this.AppointmentRepository.cancelAppointment(
                appointmentId,
                reason
            );
            if (response) {
                return response;
            } else {
                throw new Error("Something went wrong");
            }
        } catch (error: any) {
            console.error("Error in cancel:", error.stack || error.message);
            throw new Error(`Failed to cancel: ${error.message}`);
        }
    }
    async addPrescription(
        appointmentId: string,
        prescription: string
    ): Promise<any> {
        try {
            const response = await this.AppointmentRepository.completeAppointment(
                appointmentId,
                prescription
            );

            if (response) {
                return response;
            } else {
                throw new Error(
                    "Failed to complete the appointment: Invalid response from repository"
                );
            }
        } catch (error: any) {
            console.error("Error in addPrescription:", error.message);
            throw new Error(`Failed to add prescription: ${error.message}`);
        }
    }

    async getMedicalRecords(userId: string): Promise<IAppointmentWithDetails[]> {
        try {
            const response = await this.AppointmentRepository.getMedicalRecords(userId);

            return response;
        } catch (error: any) {
            console.error("Error in getDoctor:", error.message);
            throw new Error(`Failed to get specialization: ${error.message}`);
        }
    }


}