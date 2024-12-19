import { IAppointmentWithDetails } from "../IDoctorRepository";

export interface IAppointmentRepository {
  getMedicalRecords(userId: string): Promise<IAppointmentWithDetails[]>;

  cancelAppointment(appointmentId: string, reason: string): Promise<void>;

  completeAppointment(
    appointmentId: string,
    prescription: string
  ): Promise<IAppointmentWithDetails>;
  findAppointmentsByDoctor(
    doctorId: string,
    page: number,
    limit: number,
    status: string
  ): Promise<{
    appointments: IAppointmentWithDetails[];
    total: number;
  }>;
}
