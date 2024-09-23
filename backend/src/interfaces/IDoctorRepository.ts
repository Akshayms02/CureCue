import { IDoctor } from "../models/doctorModel";
import { DoctorData, docDetails } from "./doctorInterfaces";

export interface IDoctorRepository {
  existUser(email: string): Promise<IDoctor | null>;
  createUser(userData: IDoctor): Promise<IDoctor>;
  userLoginValidate(email: string, password: string): Promise<IDoctor>;
  uploadDoctorData(data: DoctorData, docDetails: docDetails): Promise<any>;
}
