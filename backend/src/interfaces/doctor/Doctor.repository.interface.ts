import { IDoctor } from "../../models/doctorModel";

import { ITransaction } from "../../models/walletModel";
import { docDetails, DoctorData } from "../doctorInterfaces";


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
export interface IDoctorRepository {
  getWalletDetails(
    doctorId: string,
    status: string,
    page: number,
    limit: number
  ): Promise<any>;

  withdrawMoney(
    doctorId: string,
    withdrawalAmount: number
  ): Promise<{
    balance: number;
    transactions: ITransaction[];
  }>;

  getDoctorData(doctorId: string): Promise<any>;
  updateProfile(updateData: {
    doctorId: string;
    fees: number;
    gender: string;
    phone: string;
  }): Promise<IDoctor>;
  existUser(email: string): Promise<IDoctor | null>

  getAllStatistics(doctorId: string): Promise<IStatisticsResult>;

  uploadDoctorData(
    data: DoctorData,
    docDetails: docDetails
  ): Promise<IDoctor | false>;
}
