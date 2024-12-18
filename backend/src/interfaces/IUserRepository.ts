import { IUser } from "../models/userModel";
import { IAppointment } from "../models/appointmentModel";
import { IDoctor } from "../models/doctorModel";
import { ISpecialization } from "../models/specializationModel";
import mongoose from "mongoose";

export interface IUserRepository {
  existUser(email: string): Promise<IUser | null>;
  getUserById(userId: string): Promise<IUser | null>;
  updatePassword(userId: string, hashedPassword: string): Promise<IUser>;
  createUser(userData: IUser): Promise<IUser>;
  userLoginValidate(email: string, password: string): Promise<IUser | null>;
  getDoctors(): Promise<IDoctor[]>;
  getSpecializations(
    skip: number,
    limit: number
  ): Promise<{ specializations: ISpecialization[]; total: number }>;
  getDepDoctors(departmentId: string): Promise<IDoctor[]>;
  getDoctorData(doctorId: string): Promise<IDoctor | null>;
  getSlots(
    doctorId: string,
    date: Date
  ): Promise<{ start: Date; end: Date; isAvailable: boolean }[]>;
  findAvailableSlot(
    doctorId: string,
    userId: string,
    start: string,
    date: Date,
    session: mongoose.ClientSession
  ): Promise<{
    slotId: string;
    doctorId: string;
    userId: string;
    startTime: Date;
    endTime: Date;
    timeSlots: [{ start: Date; end: Date }];
  } | null>;
  bookSlot(
    slot: {
      slotId: string;
      doctorId: string;
      userId: string;
      startTime: Date;
      endTime: Date;
    },
    userId: string,
    session: mongoose.ClientSession
  ): Promise<IAppointment>;
  createAppointment(
    data: any,
    session: mongoose.ClientSession
  ): Promise<IAppointment>;
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
  }): Promise<IUser>;
  cancelAppointment(appointmentId: string): Promise<any>;
  getAllAppointments(
    userId: string,
    status: string,
    page: number,
    limit: number
  ): Promise<{ appointments: IAppointment[]; totalPages: number }>;
  getAppointment(appointmentId: string): Promise<IAppointment | null>;
  addReview(
    appointmentId: string,
    rating: number,
    reviewText: string
  ): Promise<IAppointment>;
  getDoctorReview(doctorId: string): Promise<{
    doctorId: string;
    reviews: { rating: number; reviewText: string }[];
    image: { type: string; url: string };
  }>;
}
