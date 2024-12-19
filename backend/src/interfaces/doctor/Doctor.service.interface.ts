import { IDoctor } from "../../models/doctorModel";
import { ITransaction, IWallet } from "../../models/walletModel";
import { DoctorData, DoctorFiles } from "../doctorInterfaces";

interface IStatisticsResult {
  totalRevenue: number;
  monthlyRevenue: Array<{
    month: string;
    totalRevenue: number;
  }>;
  totalAppointments: number;
  todaysAppointments: number;
  numberOfPatients: number;
}
export interface IDoctorService {
  getWallet(
    doctorId: string,
    status: string,
    page: number,
    limit: number
  ): Promise<IWallet>;

  uploadDoctorData(
    data: DoctorData,
    files: DoctorFiles
  ): Promise<IDoctor | undefined>;

  withdraw(
    doctorId: string,
    withdrawalAmount: number
  ): Promise<{
    balance: number;
    transactions: ITransaction[];
  }>;

  getDoctorData(doctorId: string): Promise<IDoctor>;
  updateProfile(updateData: {
    doctorId: string;
    fees: number;
    gender: string;
    phone: string;
  }): Promise<IDoctor>;
  getDashboardData(doctorId: string): Promise<IStatisticsResult>;
  checkStatus(
    email: string
  ): Promise<{ isBlocked: boolean; kycStatus: string } | undefined>

}
