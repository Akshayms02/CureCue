import { IAdmin } from "../models/adminModel";

export interface IAdminRepository {
  adminCheck(email: string): Promise<IAdmin>;
  createSpecialization(name: string, description: string): Promise<any>;
  getAllSpecialization(): Promise<any>;
  updateSpecialization(
    id: number,
    name: string,
    description: string
  ): Promise<any>;
  changeSpecializationStatus(id: number): Promise<any>;
  getAllUsers(): Promise<any>;
  getAllDoctors(): Promise<any>;
  changeUserStatus(id: string): Promise<any>;
  changeDoctorStatus(id: string): Promise<any>;
  getAllApplications(): Promise<any>;
  getSingleDoctorApplication(id: string): Promise<any>;
  approveDoctor(doctorId: string): Promise<any>;
  getDoctorData(doctorId: string): Promise<any>;
  getAllStatistics(): Promise<any>;
}
