import { IDoctor } from "../../models/doctorModel";



export interface IUserService {

    getSpecialization(
        page: number,
        limit: number
    ): Promise<{
        specializations: any[];
        totalPages: number;
        currentPage: number;
    }>;

    checkStatus(email: string): Promise<any>

    getDepDoctors(departmentId: string): Promise<IDoctor[]>;
    getAllDoctors(): Promise<any>;
    getDoctorData(doctorId: string): Promise<IDoctor | null>;

    getReviewData(doctorId: string): Promise<any>

    getSlots(
        doctorId: string,
        date: string
    ): Promise<{ start: Date; end: Date; isAvailable: boolean }[]>;
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
    changePassword(
        userId: string,
        currentPassword: string,
        newPassword: string
    ): Promise<any>



};