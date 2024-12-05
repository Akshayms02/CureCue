import { IUser } from "../models/userModel";


export interface IUserServices {
    registeUser(userData: IUser): Promise<void | boolean>;
    otpVerify(email: string, inputOtp: string): Promise<boolean>;
    verifyLogin(email: string, password: string): Promise<{
        userInfo: { name: string; email: string };
        accessToken: string;
        refreshToken: string;
    }>;
    resendOtp(email: string): Promise<boolean>;
    checkStatus(email: string): Promise<any>;
    getAllDoctors(): Promise<any>;
    getSpecialization(page: number, limit: number): Promise<{
        specializations: any[];
        totalPages: number;
        currentPage: number;
    }>;
    getDepDoctors(departmentId: string): Promise<any>;
    getDoctorData(doctorId: string): Promise<any>;
    getSlots(doctorId: string, date: string): Promise<any>;
    createAppointment(data: any): Promise<any>;
    holdSlot(
        doctorId: string,
        date: Date,
        startTime: Date,
        userId: string,
        holdDurationMinutes?: number
    ): Promise<any>;
    checkHold(doctorId: string, date: Date, startTime: Date): Promise<any>;
    updateProfile(updateData: {
        userId: string;
        name: string;
        DOB: string;
        gender: string;
        phone: string;
        email: string;
    }): Promise<any>;
    getAppointments(
        userId: string,
        status: string,
        page: number,
        limit: number
    ): Promise<any>;
    getAppointment(appointmentId: string): Promise<any>;
}
