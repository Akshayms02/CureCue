import mongoose from "mongoose";
import { IDoctor } from "../../models/doctorModel";
import { ISpecialization } from "../../models/specializationModel";
import { IUser } from "../../models/userModel";


export interface IUserRepository {
    getSpecializations(
        skip: number,
        limit: number
    ): Promise<{ specializations: ISpecialization[]; total: number }>;

    getDepDoctors(departmentId: string): Promise<IDoctor[]>;

    getDoctors(): Promise<IDoctor[]>;

    holdSlot(
        doctorId: string,
        date: Date,
        startTime: Date,
        userId: string,
        holdDurationMinutes: number
    ): Promise<any>

    getDoctorData(doctorId: string): Promise<IDoctor | null>;

    getSlots(
        doctorId: string,
        date: Date
    ): Promise<{ start: Date; end: Date; isAvailable: boolean }[]>;

    getDoctorReview(doctorId: string): Promise<any>

    existUser(email: string): Promise<IUser | null>

    findAvailableSlot(
        doctorId: string,
        userId: string,
        start: string,
        date: Date,
        session: mongoose.ClientSession
    ): Promise<any>

    updatePassword(userId: string, hashedPassword: string): Promise<any>

    updateProfile(updateData: {
        userId: string;
        name: string;
        DOB: string;
        gender: string;
        phone: string;
        email: string;
    }): Promise<IUser>;

    getUserById(userId: string): Promise<IUser | null>





};