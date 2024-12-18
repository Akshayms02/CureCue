import { IAppointment } from "../models/appointmentModel";
import { IDoctor } from "../models/doctorModel";
import { IUser } from "../models/userModel";

export interface IUserServices {
  registeUser(userData: IUser): Promise<void | boolean>;
  otpVerify(email: string, inputOtp: string): Promise<boolean>;
  verifyLogin(
    email: string,
    password: string
  ): Promise<{
    userInfo: { name: string; email: string };
    accessToken: string;
    refreshToken: string;
  }>;
  resendOtp(email: string): Promise<boolean>;
  checkStatus(email: string): Promise<any>;
  getAllDoctors(): Promise<any>;
  getSpecialization(
    page: number,
    limit: number
  ): Promise<{
    specializations: any[];
    totalPages: number;
    currentPage: number;
  }>;
  getDepDoctors(departmentId: string): Promise<IDoctor[]>;
  getDoctorData(doctorId: string): Promise<IDoctor | null>;
  getSlots(
    doctorId: string,
    date: string
  ): Promise<{ start: Date; end: Date; isAvailable: boolean }[]>;
  createAppointment(data: any): Promise<IAppointment>;
  holdSlot(
    doctorId: string,
    date: Date,
    startTime: Date,
    userId: string,
    holdDurationMinutes?: number
  ): Promise<{ success: boolean; message: string }>;
  checkHold(
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
  >;
  updateProfile(updateData: {
    userId: string;
    name: string;
    DOB: string;
    gender: string;
    phone: string;
    email: string;
  }): Promise<{
    name: string;
    email: string;
    userId: string;
    phone: string;
    isBlocked: boolean;
  }>;
  getAppointments(
    userId: string,
    status: string,
    page: number,
    limit: number
  ): Promise<{ appointments: IAppointment[]; totalPages: number }>;
  getAppointment(appointmentId: string): Promise<IAppointment>;
}
