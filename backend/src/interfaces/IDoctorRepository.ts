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
}
