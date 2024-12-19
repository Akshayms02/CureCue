import { Types } from 'mongoose';
import { IAdmin } from '../models/adminModel';
import { ISpecialization } from '../models/specializationModel';
import { IUser } from '../models/userModel';
import { IDoctor } from '../models/doctorModel';
import { IDoctorApplication } from '../models/doctorApplicationModel';

export interface IDepartment {
  _id: Types.ObjectId;
  name: string;
  description?: string;
}


export interface IUserPaginationResult {
  users: IUser[];
  totalUsers: number;
  totalPages: number;
  currentPage: number;
}

export interface IStatisticsResult {
  totalDoctors: number;
  totalUsers: number;
  activeDoctors: number;
  activeUsers: number;
  totalRevenue: number;
  doctorRevenue: number;
  adminRevenue: number;
  userDoctorChartData: Array<{
    year: number;
    month: number;
    users: number;
    doctors: number;
    revenue: number;
    totalFees: number;
    doctorRevenue: number;
    adminRevenue: number;
  }>;
}


export interface IAdminRepository {
  adminCheck(email: string): Promise<IAdmin>;
  createSpecialization(name: string, description: string): Promise<ISpecialization>;
  getAllSpecialization(): Promise<ISpecialization[]>;
  updateSpecialization(id: number, name: string, description: string): Promise<any>;
  changeSpecializationStatus(id: number): Promise<ISpecialization>;
  getAllUsers(page?: number, limit?: number): Promise<IUserPaginationResult>;
  getAllDoctors(): Promise<IDoctor[]>;
  changeUserStatus(id: string): Promise<IUser>;
  changeDoctorStatus(id: string): Promise<IDoctor>;
  getAllApplications(): Promise<IDoctorApplication[]>
  getSingleDoctorApplication(id: string): Promise<IDoctorApplication | null>;
  approveDoctor(doctorId: string): Promise<{ status: boolean }>;
  getDoctorData(doctorId: string): Promise<IDoctor | null>;
  getAllStatistics(): Promise<IStatisticsResult>;
}