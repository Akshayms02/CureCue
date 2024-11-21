import { IUser } from "../models/userModel";

export interface IUserRepository {
  existUser(email: string): Promise<IUser | null>;
  createUser(userData: IUser): Promise<IUser>;
  userLoginValidate(email: string, password: string): Promise<IUser>;
  getDoctors(): Promise<any>;
  getSpecializations(): Promise<any>;
  getDepDoctors(departmentId: string): Promise<any>;
  getDoctorData(doctorId: string): Promise<any>;
  getSlots(doctorId: string, date: Date): Promise<any>;
  findAvailableSlot(
    doctorId: any,
    userId: any,
    start: any,
    date: any,
    session: any
  ): Promise<any>;
  bookSlot(slot: any, userId: any, session: any): Promise<any>;
  createAppointment(data: any, session: any): Promise<any>;
  holdSlot(
    doctorId: any,
    date: any,
    startTime: any,
    userId: any,
    holdDurationMinutes: any
  ): Promise<any>;
  checkHold(doctorId: any, date: any, startTime: any): Promise<any>;
  updateProfile(updateData: {
    userId: string;
    name: string;
    DOB: string;
    gender: string;
    phone: string;
    email: string;
  }): Promise<any>;
  getAllAppointments(userId: string, status: string): Promise<any>;
  getAppointment(appointmentId: string): Promise<any>;
  addReview(
    appointmentId: string,
    rating: number,
    review: string
  ): Promise<any>;
  getDoctorReview(doctorId: string): Promise<any>;
  cancelAppointment(appointmentId: string): Promise<any>;
}
