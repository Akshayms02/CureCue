import { IDoctor } from "../models/doctorModel";
import { DoctorData } from "../interfaces/doctorInterfaces";
import { docDetails } from "../controllers/doctorController";
import { IAppointment } from "../models/appointmentModel";
import { ITransaction } from "../models/walletModel";


export interface IAppointmentWithDetails extends IAppointment {
  userId: string;
  doctorId: string;
}

interface ISlotTimeSlot {
  start: Date;
  end: Date;
  isBooked?: boolean;
  isOnHold?: boolean;
  heldBy?: string;
  holdExpiresAt?: Date | null;
}

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

// interface IWalletDetailsResult {
//   transactions: ITransaction[];
//   totalCount: number;
//   totalPages: number;
//   currentPage: number;
//   balance: number;
// }

export interface IDoctorRepository {
  existUser(email: string): Promise<IDoctor | null>;

  createUser(userData: IDoctor): Promise<IDoctor>;

  userLoginValidate(email: string, password: string): Promise<IDoctor>;

  uploadDoctorData(
    data: DoctorData,
    docDetails: docDetails
  ): Promise<IDoctor | false>;

  createSlot(
    parsedDate: Date,
    formattedTimeSlots: ISlotTimeSlot[],
    doctorId: string
  ): Promise<{
    status: boolean;
    message?: string;
    overlappingSlots?: ISlotTimeSlot[];
  } | undefined>;

  checkSlots(
    doctorId: string,
    date: string
  ): Promise<ISlotTimeSlot[] | undefined>;

  deleteSlot(
    start: string,
    doctorId: string,
    date: string
  ): Promise<{ status: boolean } | undefined>;

  checkAvialability(
    doctorId: string,
    parsedDate: Date,
    parsedStart: Date,
    parsedEnd: Date
  ): Promise<{ available: boolean }>;

  getDoctorData(
    doctorId: string
  ): Promise<any>;

  findAppointmentsByDoctor(
    doctorId: string,
    page: number,
    limit: number,
    status: string
  ): Promise<{
    appointments: IAppointmentWithDetails[];
    total: number;
  }>;

  updateProfile(updateData: {
    doctorId: string;
    fees: number;
    gender: string;
    phone: string;
  }): Promise<IDoctor>;

  getAllStatistics(
    doctorId: string
  ): Promise<IStatisticsResult>;

  completeAppointment(
    appointmentId: string,
    prescription: string
  ): Promise<IAppointmentWithDetails>;

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

  getMedicalRecords(
    userId: string
  ): Promise<IAppointmentWithDetails[]>;

  cancelAppointment(
    appointmentId: string,
    reason: string
  ): Promise<void>;
}