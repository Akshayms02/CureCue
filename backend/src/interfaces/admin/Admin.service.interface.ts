import { IDoctorApplication } from "../../models/doctorApplicationModel";
import { IDoctor } from "../../models/doctorModel";
import { ISpecialization } from "../../models/specializationModel";
import { IUser } from "../../models/userModel";

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

export interface IAdminService {
  addSpecialization(
    name: string,
    description: string
  ): Promise<ISpecialization>;

  getSpecialization(): Promise<ISpecialization[]>;

  editSpecialization(
    id: number,
    name: string,
    description: string
  ): Promise<{ id: number; name: string; description: string }>;

  listUnlistSpecialization(id: number): Promise<ISpecialization>;

  getUsers(page: number, limit: number): Promise<IUserPaginationResult>;

  getDoctors(): Promise<IDoctor[]>;

  listUnlistUser(id: string): Promise<IUser>;

  listUnlistDoctor(id: string): Promise<IDoctor>;

  getAllDoctorApplications(): Promise<IDoctorApplication[]>;

  getDoctorApplication(id: string): Promise<{
    response: {
      id: string;
      name: string;
      email: string;
      kycDetails: {
        certificateImage: string;
        qualificationImage: string;
        adharFrontImage: string;
        adharBackImage: string;
      };
    };
    signedFiles: { type: string; url: string; signedUrl: string }[];
  }>;

  approveApplication(
    doctorId: string
  ): Promise<{ status: boolean } | undefined>;

  getDoctorData(doctorId: string): Promise<{
    name: string;
    email: string;
    doctorId: string;
    phone: string;
    isBlocked: boolean;
    docStatus: string;
    DOB: string;
    fees: number;
    gender: string;
    department: string;
    image: string;
  }>;

  getDashboardData(): Promise<IStatisticsResult>;
}
