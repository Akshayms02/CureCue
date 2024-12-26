import { IAppointment } from "../../models/appointmentModel";


export interface IAppointmentWithDetails extends IAppointment {
  userId: string;
  doctorId: string;
}
export interface IAppointmentService {
  getAppointments(
    doctorId: string,
    page: number,
    limit: number,
    status: string
  ): Promise<any>;

  cancelAppointment(appointmentId: string, reason: string): Promise<void>;

  addPrescription(
    appointmentId: string,
    prescription: string
  ): Promise<IAppointmentWithDetails>;

  getMedicalRecords(userId: string): Promise<IAppointmentWithDetails[]>;
}
