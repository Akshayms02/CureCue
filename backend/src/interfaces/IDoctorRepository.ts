import { IDoctor } from "../models/doctorModel";
import { DoctorData, docDetails } from "./doctorInterfaces";

export interface IDoctorRepository {
  existUser(email: string): Promise<IDoctor | null>;
  createUser(userData: IDoctor): Promise<IDoctor>;
  userLoginValidate(email: string, password: string): Promise<IDoctor>;
  uploadDoctorData(data: DoctorData, docDetails: docDetails): Promise<any>;
  createSlot(
    parsedDate: any,
    formattedTimeSlots: any,
    doctorId: string
  ): Promise<any>;
  checkSlots(doctorId: string, date: string): Promise<any>;
  deleteSlot(start: string, doctorId: string, date: string): Promise<any>;
  checkAvialability(
    doctorId: string,
    parsedDate: Date,
    parsedStart: Date,
    parsedEnd: Date
  ): Promise<any>;
  getDoctorData(doctorId: string): Promise<any>;
  findAppointmentsByDoctor(doctorId: string): Promise<any>;
  updateProfile(updateData: {
    doctorId: string;
    fees: number;
    gender: string;
    phone: string;
  }): Promise<any>;
  getAllStatistics(doctorId: string): Promise<any>;
  completeAppointment(
    appointmentId: string,
    prescription: string
  ): Promise<any>;
  getMedicalRecords(userId: string): Promise<any>;
  getWalletDetails(
    doctorId: string,
    status: string,
    page: number,
    limit: number
  ): Promise<any>;
  withdrawMoney(doctorId: string, withdrawalAmount: number): Promise<any>;
  cancelAppointment(appointmentId: string, reason: string): Promise<any>;
}
