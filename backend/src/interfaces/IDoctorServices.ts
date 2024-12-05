// interfaces/IDoctorService.ts
import { IUser } from "../models/userModel";
import { DoctorData, DoctorFiles } from "../interfaces/doctorInterfaces";

export interface IDoctorService {
    registeUser(userData: IUser): Promise<void | boolean>;
    otpVerify(email: string, inputOtp: string): Promise<boolean>;
    verifyLogin(email: string, password: string): Promise<{
        doctorInfo: { name: string; email: string };
        docaccessToken: string;
        refreshToken: string;
    }>;
    resendOtp(email: string): Promise<boolean>;
    uploadDoctorData(data: DoctorData, files: DoctorFiles): Promise<any>;
    checkStatus(email: string): Promise<{ isBlocked: boolean; kycStatus: string }|undefined>;
    scheduleSlot(date: string, timeSlots: any[], doctorId: string): Promise<any>;
    checkSlots(doctorId: string, date: string): Promise<any>;
    deleteSlot(start: string, doctorId: string, date: string): Promise<any>;
    checkAvialability(doctorId: string, date: string, start: string, end: string): Promise<any>;
    getDoctorData(doctorId: string): Promise<any>;
    getAppointments(doctorId: string): Promise<any>;
    updateProfile(updateData: {
        doctorId: string;
        fees: number;
        gender: string;
        phone: string;
    }): Promise<any>;
}
