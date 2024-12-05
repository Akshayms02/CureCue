import { IUser } from "../models/userModel";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import redisClient from "../utils/redisCaching";
import sendEmailOtp from "../config/nodemailer";
import { createRefreshToken, createToken } from "../config/jwtConfig";

import { IDoctorRepository } from "../interfaces/IDoctorRepository";
import {
  docDetails,
  DoctorFiles,
  DoctorData,
  FileData,
} from "../interfaces/doctorInterfaces";
import { AwsConfig } from "../config/awsConfig";
import { IDoctorService } from "../interfaces/IDoctorServices";

interface ITimeSlot {
  start: string;
  end: string;
}
export class doctorServices implements IDoctorService {
  constructor(
    private doctorRepository: IDoctorRepository,
    private S3Service: AwsConfig
  ) {
    this.doctorRepository = doctorRepository;
    this.S3Service = S3Service;
  }
  private getFolderPathByFileType(fileType: string): string {
    switch (fileType) {
      case "profile image":
        return "cureCue/doctorProfileImages";
      case "document":
        return "cureCue/doctorDocuments";

      default:
        throw new Error(`Unknown file type: ${fileType}`);
    }
  }

  async registeUser(userData: IUser): Promise<void | boolean> {
    try {
      const existingUser = await this.doctorRepository.existUser(
        userData.email
      );
      if (existingUser) {
        throw Error("Email already in use");
      }

      const saltRounds: number = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      const doctorId = uuidv4();
      const tempUserData = {
        doctorId: doctorId,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: hashedPassword,
        createdAt: new Date(),
        kycStatus: "pending",
      };

      await redisClient.setEx(
        `tempUserData${userData.email}`,
        400,
        JSON.stringify(tempUserData)
      );

      const otp = Math.floor(1000 + Math.random() * 9000).toString();

      await redisClient.setEx(userData.email, 60, otp);

      sendEmailOtp(userData.email, otp);

      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(
          `Error has occured in doctorServices register:${error.message}`
        );
      } else {
        throw new Error("Unknown Error");
      }
    }
  }

  async otpVerify(email: string, inputOtp: string): Promise<boolean> {
    try {
      const cachedOtp = await redisClient.get(email);

      if (!cachedOtp) {
        throw new Error("OTP Expired or not found");
      } else if (cachedOtp !== inputOtp) {
        throw new Error("Wrong OTP");
      } else {
        const tempUserData = await redisClient.get(`tempUserData${email}`);

        if (!tempUserData) {
          throw new Error("Temporary userData not found or Expired");
        }

        const userData = JSON.parse(tempUserData);
        await this.doctorRepository.createUser(userData);

        await redisClient.del(email);
        await redisClient.del(`tempUserData${email}`);

        return true;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unknown error has occured");
      }
    }
  }

  async verifyLogin(
    email: string,
    password: string
  ): Promise<{
    doctorInfo: { name: string; email: string };
    docaccessToken: string;
    refreshToken: string;
  }> {
    try {
      const user = await this.doctorRepository.userLoginValidate(
        email,
        password
      );
      if (!user) {
        throw new Error("Invalid Login Credentails");
      }
      const docaccessToken = createToken(user.doctorId as string, "doctor");
      const refreshToken = createRefreshToken(
        user.doctorId as string,
        "doctor"
      );

      let imageUrl = "";

      if (user?.image) {
        const folderPath = this.getFolderPathByFileType(user?.image?.type);
        const signedUrl = await this.S3Service.getFile(
          user.image.url,
          folderPath
        );
        imageUrl = signedUrl;
      }

      const doctorInfo = {
        name: user.name,
        email: user.email,
        doctorId: user.doctorId,
        phone: user.phone,
        isBlocked: user.isBlocked,
        docStatus: user.kycStatus,
        DOB: user.DOB,
        fees: user.fees,
        gender: user.gender,
        department: user.department,
        image: imageUrl,
      };

      return { doctorInfo, docaccessToken, refreshToken };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("Unknown Error Occured from doctorServices");
      }
    }
  }

  async resendOtp(email: string): Promise<boolean> {
    try {
      const otp = Math.floor(1000 + Math.random() * 9000).toString();

      await redisClient.setEx(email, 60, otp);

      sendEmailOtp(email, otp);

      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(
          "An unknow Error has occured in doctorServices resendOtp"
        );
      }
    }
  }

  async uploadDoctorData(data: DoctorData, files: DoctorFiles) {
    try {
      const docDetails: docDetails = {
        profileUrl: { type: "", url: "" },
        aadhaarFrontImageUrl: { type: "", url: "" },
        aadhaarBackImageUrl: { type: "", url: "" },
        certificateUrl: { type: "", url: "" },
        qualificationUrl: { type: "", url: "" },
      };

      const uploadFileAndAssign = async (
        folder: string,
        file: FileData,
        docKey: keyof docDetails,
        docType: string
      ) => {
        const fileUrl = await this.S3Service.uploadFile(folder, file);
        docDetails[docKey] = { url: fileUrl, type: docType };
      };

      const uploadPromises: Promise<void>[] = [];

      if (files.image) {
        uploadPromises.push(
          uploadFileAndAssign(
            "cureCue/doctorProfileImages/",
            files.image[0],
            "profileUrl",
            "profile image"
          )
        );
      }
      if (files.aadhaarFrontImage) {
        uploadPromises.push(
          uploadFileAndAssign(
            "cureCue/doctorDocuments/",
            files.aadhaarFrontImage[0],
            "aadhaarFrontImageUrl",
            "document"
          )
        );
      }
      if (files.aadhaarBackImage) {
        uploadPromises.push(
          uploadFileAndAssign(
            "cureCue/doctorDocuments/",
            files.aadhaarBackImage[0],
            "aadhaarBackImageUrl",
            "document"
          )
        );
      }
      if (files.certificateImage) {
        uploadPromises.push(
          uploadFileAndAssign(
            "cureCue/doctorDocuments/",
            files.certificateImage[0],
            "certificateUrl",
            "document"
          )
        );
      }
      if (files.qualificationImage) {
        uploadPromises.push(
          uploadFileAndAssign(
            "cureCue/doctorDocuments/",
            files.qualificationImage[0],
            "qualificationUrl",
            "document"
          )
        );
      }

      await Promise.all(uploadPromises);

      const response = await this.doctorRepository.uploadDoctorData(
        data,
        docDetails
      );

      if (response) {
        return response;
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async checkStatus(email: string): Promise<{ isBlocked: boolean; kycStatus: string } | undefined> {
    try {
      const user = await this.doctorRepository.existUser(email);
      if (!user) {
        throw new Error("User not found");
      }
      return { isBlocked: user.isBlocked as boolean, kycStatus: user.kycStatus as string };
    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async scheduleSlot(date: string, timeSlots: ITimeSlot[], doctorId: string) {
    try {
      const parsedDate = new Date(date);
      console.log(timeSlots);

      // Format the timeSlots array to match the schema
      const formattedTimeSlots = timeSlots.map((slot: any) => ({
        start: new Date(slot.start),
        end: new Date(slot.end),
        isBooked: false,
        isOnHold: false,
        holdExpiresAt: null,
      }));

      const response = await this.doctorRepository.createSlot(
        parsedDate,
        formattedTimeSlots,
        doctorId
      );
      if (response.status) {
        return { status: true };
      } else {
        throw new Error("Some of the slots here are already scheduled");
      }
    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async checkSlots(doctorId: string, date: string) {
    try {
      const response = await this.doctorRepository.checkSlots(
        doctorId as string,
        date as string
      );

      if (response) {
        return response;
      }
    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
  async deleteSlot(start: string, doctorId: string, date: string) {
    try {
      const reponse = await this.doctorRepository.deleteSlot(
        start as string,
        doctorId as string,
        date as string
      );
      if (reponse.status) {
        return { status: true };
      }
    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async checkAvialability(
    doctorId: string,
    date: string,
    start: string,
    end: string
  ) {
    try {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date format");
      }

      const parsedStart = new Date(start);
      const parsedEnd = new Date(end);
      if (
        isNaN(parsedStart.getTime()) ||
        isNaN(parsedEnd.getTime()) ||
        parsedEnd <= parsedStart
      ) {
        throw new Error("Invalid start or end time");
      }

      const response = this.doctorRepository.checkAvialability(
        doctorId as string,
        parsedDate as Date,
        parsedStart as Date,
        parsedEnd as Date
      );

      if (response) {
        return response;
      }
    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async getDoctorData(doctorId: string) {
    try {
      const response = await this.doctorRepository.getDoctorData(doctorId);
      let imageUrl = "";
      console.log(response);

      if (response?.image) {
        const folderPath = this.getFolderPathByFileType(response?.image?.type);
        const signedUrl = await this.S3Service.getFile(
          response.image.url,
          folderPath
        );
        imageUrl = signedUrl;
      }
      response.imageUrl = imageUrl;
      console.log(response);
      if (response) {
        return response;
      }
    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async getAppointments(doctorId: string) {
    try {
      const appointments = await this.doctorRepository.findAppointmentsByDoctor(
        doctorId
      );

      return appointments;
    } catch (error: any) {
      console.log(error);
      throw new Error("Error fetching appointments from service");
    }
  }

  async updateProfile(updateData: {
    doctorId: string;
    fees: number;
    gender: string;
    phone: string;
  }): Promise<any> {
    try {
      console.log(updateData);
      const updatedDoctor = await this.doctorRepository.updateProfile(
        updateData
      );
      let imageUrl = "";

      if (updatedDoctor?.image) {
        const folderPath = this.getFolderPathByFileType(
          updatedDoctor?.image?.type
        );
        const signedUrl = await this.S3Service.getFile(
          updatedDoctor.image.url,
          folderPath
        );
        imageUrl = signedUrl;
      }

      const doctorInfo = {
        name: updatedDoctor.name,
        email: updatedDoctor.email,
        doctorId: updatedDoctor.doctorId,
        phone: updatedDoctor.phone,
        isBlocked: updatedDoctor.isBlocked,
        docStatus: updatedDoctor.kycStatus,
        DOB: updatedDoctor.DOB,
        fees: updatedDoctor.fees,
        gender: updatedDoctor.gender,
        department: updatedDoctor.department,
        image: imageUrl,
      };

      return { doctorInfo };
    } catch (error: any) {
      console.error("Error in updateProfile:", error.message);
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }

  async getDashboardData(doctorId: string) {
    try {
      console.log("Entering getDashboardData method in docService");

      const response = await this.doctorRepository.getAllStatistics(
        doctorId as string
      );

      if (response) {
        console.log("Dashboarddd data successfully retrieved:", response);
        return response;
      } else {
        console.error("Failed to retrieve dashboard data: Response is invalid");
        throw new Error(
          "Something went wrong while retrieving dashboard data."
        );
      }
    } catch (error: any) {
      console.error("Error in getDashboardData:", error.message);
      throw new Error(`Failed to retrieve dashboard data: ${error.message}`);
    }
  }

  async addPrescription(
    appointmentId: string,
    prescription: string
  ): Promise<any> {
    try {
      const response = await this.doctorRepository.completeAppointment(
        appointmentId,
        prescription
      );

      if (response) {
        return response;
      } else {
        throw new Error(
          "Failed to complete the appointment: Invalid response from repository"
        );
      }
    } catch (error: any) {
      console.error("Error in addPrescription:", error.message);
      throw new Error(`Failed to add prescription: ${error.message}`);
    }
  }
  async getWallet(
    doctorId: string,
    status: string,
    page: number,
    limit: number
  ) {
    try {
      const response = await this.doctorRepository.getWalletDetails(
        doctorId,
        status,
        page,
        limit
      );
      return response;
    } catch (error: any) {
      console.error("Error in getWallet:", error.stack || error.message);
      throw new Error(`Failed to get wallet details: ${error.message}`);
    }
  }
  async getMedicalRecords(userId: string): Promise<any> {
    try {
      const response = await this.doctorRepository.getMedicalRecords(userId);

      return response;
    } catch (error: any) {
      console.error("Error in getDoctor:", error.message);
      throw new Error(`Failed to get specialization: ${error.message}`);
    }
  }

  async withdraw(doctorId: string, withdrawalAmount: number) {
    try {
      const response = await this.doctorRepository.withdrawMoney(
        doctorId,
        withdrawalAmount
      );

      return response;
    } catch (error: any) {
      console.error("Error in withdraw:", error.stack || error.message);
      throw new Error(`Failed to withdraw: ${error.message}`);
    }
  }

  async cancelAppointment(appointmentId: string, reason: string): Promise<any> {
    try {
      const response = this.doctorRepository.cancelAppointment(
        appointmentId,
        reason
      );
      if (response) {
        return response;
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error: any) {
      console.error("Error in cancel:", error.stack || error.message);
      throw new Error(`Failed to cancel: ${error.message}`);
    }
  }
}
