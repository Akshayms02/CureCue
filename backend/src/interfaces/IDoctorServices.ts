import { DoctorData, DoctorFiles } from "../interfaces/doctorInterfaces";
import { IDoctor } from "../models/doctorModel";
import { IAppointmentWithDetails } from "./IDoctorRepository";
import { ITransaction } from "../models/walletModel";


interface IStatisticsResult {
  totalRevenue: number;
  monthlyRevenue: Array<{
    month: string;
    totalRevenue: number;
  }>;
  totalAppointments: number;
  todaysAppointments: number;
  numberOfPatients: number;
}
interface ISlotTimeSlot {
  start: Date;
  end: Date;
  isBooked?: boolean;
  isOnHold?: boolean;
  heldBy?: string;
  holdExpiresAt?: Date | null;
}
export interface IDoctorService {
  registeUser(userData: IDoctor): Promise<void | boolean>;
  otpVerify(email: string, inputOtp: string): Promise<boolean>;
  verifyLogin(
    email: string,
    password: string
  ): Promise<{
    doctorInfo: { name: string; email: string };
    docaccessToken: string;
    refreshToken: string;
  }>;
  resendOtp(email: string): Promise<boolean>;
  uploadDoctorData(
    data: DoctorData,
    files: DoctorFiles
  ): Promise<IDoctor | undefined>;
  checkStatus(
    email: string
  ): Promise<{ isBlocked: boolean; kycStatus: string } | undefined>;
  scheduleSlot(
    date: string,
    timeSlots: any[],
    doctorId: string
  ): Promise<{ status: boolean } | undefined>;
  addPrescription(
    appointmentId: string,
    prescription: string
  ): Promise<IAppointmentWithDetails>;
  getMedicalRecords(userId: string): Promise<IAppointmentWithDetails[]>;
  checkSlots(
    doctorId: string,
    date: string
  ): Promise<ISlotTimeSlot[] | undefined>;
  deleteSlot(
    start: string,
    doctorId: string,
    date: string
  ): Promise<{ status: boolean } | undefined>;
  checkAvialability(
    doctorId: string,
    date: string,
    start: string,
    end: string
  ): Promise<{ available: boolean } | undefined>;
  getDoctorData(doctorId: string): Promise<IDoctor>;
  getAppointments(
    doctorId: string,
    page: number,
    limit: number,
    status: string
  ): Promise<any>;
  cancelAppointment(appointmentId: string, reason: string): Promise<void>;
  updateProfile(updateData: {
    doctorId: string;
    fees: number;
    gender: string;
    phone: string;
  }): Promise<IDoctor>;
  withdraw(
    doctorId: string,
    withdrawalAmount: number
  ): Promise<{
    balance: number;
    transactions: ITransaction[];
  }>;
  getDashboardData(doctorId: string): Promise<IStatisticsResult>;
}
