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
  getAllApplication(): Promise<any>;
  getApplication(doctorId: string): Promise<any>;
  approveDoctorApplication(doctorId: string): Promise<any>;
  rejectDoctorApplication(doctorId: string, reason: string): Promise<any>;
}
