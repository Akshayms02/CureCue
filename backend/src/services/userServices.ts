import { IUserRepository } from "../interfaces/IUserRepository";
import { IUser } from "../models/userModel";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import redisClient from "../utils/redisCaching";
import sendEmailOtp from "../config/nodemailer";
import { AwsConfig } from "../config/awsConfig";
import { createToken, createRefreshToken } from "../config/jwtConfig";
import mongoose from "mongoose";
import razorpay from "../config/razorpay";
import { IUserServices } from "../interfaces/IUserServices";
import { IAppointment } from "../models/appointmentModel";

export class userServices implements IUserServices {
  constructor(
    private userRepositary: IUserRepository,
    private S3Service: AwsConfig
  ) {}

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
      const existingUser = await this.userRepositary.existUser(userData.email);
      if (existingUser) {
        throw Error("Email already in use");
      }

      const saltRounds: number = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      const userId = uuidv4();
      const tempUserData = {
        userId: userId,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: hashedPassword,
        createdAt: new Date(),
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
          `Error has occured in UserServices register:${error.message}`
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
        await this.userRepositary.createUser(userData);

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
    userInfo: { name: string; email: string };
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      const user = await this.userRepositary.userLoginValidate(email, password);
      if (!user) {
        throw new Error("Invalid Login Credentails");
      }
      const accessToken = createToken(user.userId as string, "user");

      const refreshToken = createRefreshToken(user.userId as string, "user");

      const userInfo = {
        name: user.name,
        email: user.email,
        userId: user.userId,
        phone: user.phone,
        isBlocked: user.isBlocked,
        DOB: user.DOB,
        gender: user.gender,
      };

      console.log(userInfo);

      return { userInfo, accessToken, refreshToken };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("Unknown Error Occured from UserServices");
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
          "An unknow Error has occured in UserServices resendOtp"
        );
      }
    }
  }

  async checkStatus(email: string): Promise<any> {
    try {
      const response = this.userRepositary.existUser(email);
      return response;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getAllDoctors() {
    try {
      const response = await this.userRepositary.getDoctors();

      const docs = await Promise.all(
        response.map(async (doctor: any) => {
          let profileUrl = "";
          if (doctor?.image?.url) {
            const filePath = this.getFolderPathByFileType(doctor?.image?.type);
            profileUrl = await this.S3Service.getFile(
              doctor?.image?.url,
              filePath
            );
          }
          return {
            name: doctor?.name,
            email: doctor?.email,
            profileUrl: profileUrl,
            doctorId: doctor?.doctorId,
            department: doctor?.department.name,
          };
        })
      );
      return docs;
    } catch (error: any) {
      throw new Error(error);
    }
  }
  async getSpecialization(page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;

      const { specializations, total } =
        await this.userRepositary.getSpecializations(skip, limit);

      const totalPages = Math.ceil(total / limit);

      return {
        specializations,
        totalPages,
        currentPage: page,
      };
    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Error fetching specializations");
    }
  }

  async getDepDoctors(departmentId: string): Promise<any> {
    try {
      const response = await this.userRepositary.getDepDoctors(departmentId);
      console.log(departmentId);
      const docs = await Promise.all(
        response.map(async (doctor: any) => {
          let profileUrl = "";
          if (doctor?.image?.url) {
            const filePath = this.getFolderPathByFileType(doctor?.image?.type);
            profileUrl = await this.S3Service.getFile(
              doctor?.image?.url,
              filePath
            );
          }
          return {
            name: doctor?.name,
            email: doctor?.email,
            profileUrl: profileUrl,
            doctorId: doctor?.doctorId,
            department: doctor?.department.name,
          };
        })
      );

      return docs;
    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async getDoctorData(doctorId: string): Promise<any> {
    try {
      const response = await this.userRepositary.getDoctorData(
        doctorId as string
      );
      if (response) {
        let profileUrl = "";
        if (response?.image?.url) {
          const filePath = this.getFolderPathByFileType(response?.image?.type);
          profileUrl = await this.S3Service.getFile(
            response?.image?.url,
            filePath
          );
          if (profileUrl) {
            response.profileUrl = profileUrl;
          }
        }
        console.log(response);

        return response;
      }
    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async getSlots(
    doctorId: string,
    date: string
  ): Promise<{ start: Date; end: Date; isAvailable: boolean }[]> {
    try {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date format");
      }

      const response = await this.userRepositary.getSlots(doctorId, parsedDate);

      if (!response) {
        throw new Error("No response received from the repository");
      }

      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(errorMessage);
    }
  }

  async createAppointment(data: any): Promise<IAppointment> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const {
        doctorId,
        userId,
        paymentId,
        amount,
        date,
        patientName,
        timeslotId,
      } = data;
      const parseDate = new Date(date);
      console.log(data);

      // Call the repository to find a valid slot
      const slot = await this.userRepositary.findAvailableSlot(
        doctorId,
        userId,
        timeslotId,
        new Date(date),
        session
      );
      console.log(slot);
      if (!slot) {
        throw new Error("No valid time slot found");
      }
      const timeSlot = slot.timeSlots.filter(
        (element: any) => element.start.toISOString() == timeslotId
      );

      await this.userRepositary.bookSlot(slot, userId, session);

      const newAppointment = await this.userRepositary.createAppointment(
        {
          doctorId,
          userId,
          paymentId,
          fees: amount,
          start: timeSlot[0].start,
          end: timeSlot[0].end,
          date: parseDate,
          patientName: patientName,
        },
        session
      );

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return newAppointment;
    } catch (error: any) {
      // Rollback transaction on error
      console.log(error);
      await session.abortTransaction();
      session.endSession();
      throw new Error("Failed to book appointment");
    }
  }

  async holdSlot(
    doctorId: string,
    date: Date,
    startTime: Date,
    userId: string,
    holdDurationMinutes: number = 5
  ): Promise<{ success: boolean; message: string }> {
    console.log("holding time slot service");
    console.log(startTime);
    return await this.userRepositary.holdSlot(
      doctorId,
      date,
      startTime,
      userId,
      holdDurationMinutes
    );
  }

  async checkHold(
    doctorId: string,
    date: Date,
    startTime: Date
  ): Promise<
    {
      slotId: string;
      userId: string;
      isOnHold: boolean;
      timeSlots: [{ start: Date; end: Date; isOnHold: boolean }];
    }[]
  > {
    return await this.userRepositary.checkHold(doctorId, date, startTime);
  }

  async updateProfile(updateData: {
    userId: string;
    name: string;
    DOB: string;
    gender: string;
    phone: string;
    email: string;
  }): Promise<{
    name: string;
    email: string;
    userId: string;
    phone: string;
    isBlocked: boolean;
  }> {
    try {
      const updatedUser = await this.userRepositary.updateProfile(updateData);

      if (updatedUser.image != null) {
        const folderPath = this.getFolderPathByFileType(updatedUser.image.type);
        const signedUrl = await this.S3Service.getFile(
          updatedUser.image.url,
          folderPath
        );

        updatedUser.image.url = signedUrl;
      }

      const userInfo = {
        name: updatedUser.name,
        email: updatedUser.email,
        userId: updatedUser.userId,
        phone: updatedUser.phone,
        isBlocked: updatedUser.isBlocked,
      };

      return userInfo;
    } catch (error: any) {
      console.error("Error in updateProfile:", error.message);
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }

  async getAppointments(
    userId: string,
    status: string,
    page: number,
    limit: number
  ) {
    try {
      const response = await this.userRepositary.getAllAppointments(
        userId,
        status,
        page,
        limit
      );

      if (response.appointments) {
        return response;
      } else {
        console.error("Failed to get appointments: Response is invalid");
        throw new Error(
          "Something went wrong while fetching the appointments."
        );
      }
    } catch (error: any) {
      console.error("Error in getAppointments:", error.message);
      throw new Error(`Failed to get appointments: ${error.message}`);
    }
  }

  async getAppointment(appointmentId: string): Promise<any> {
    try {
      const response = await this.userRepositary.getAppointment(appointmentId);

      if (response) {
        console.log("appointments", response);

        const updatedAppointment = {
          ...response,
          start: new Date(response.start as Date),
          end: new Date(response.end as Date),
        };

        console.log("updated appointment", updatedAppointment);

        return updatedAppointment;
      } else {
        console.error("Failed to get appointment: Response is invalid");
        throw new Error("Something went wrong while fetching the appointment.");
      }
    } catch (error: any) {
      console.error("Error in getAppointment:", error.message);
      throw new Error(`Failed to get appointment: ${error.message}`);
    }
  }
  async addReview(
    appointmentId: string,
    rating: number,
    review: string
  ): Promise<any> {
    try {
      const response = await this.userRepositary.addReview(
        appointmentId,
        rating,
        review
      );

      if (!response) {
        throw new Error("Appointment not found or review could not be added");
      }

      return response;
    } catch (error: any) {
      console.error("Error in addReview:", error.message);

      throw new Error(`Failed to add review: ${error.message}`);
    }
  }

  async getReviewData(doctorId: string) {
    try {
      const response = await this.userRepositary.getDoctorReview(doctorId);

      if (response?.image && response.image.url && response.image.type) {
        const folderPath = this.getFolderPathByFileType(response.image.type);
        const signedUrl = await this.S3Service.getFile(
          response.image.url,
          folderPath
        );

        return {
          ...response,
          signedImageUrl: signedUrl,
        };
      }
    } catch (error: any) {
      console.error("Error in getDoctor:", error.message);
      throw new Error(`Failed to get specialization: ${error.message}`);
    }
  }

  async cancelAppointment(appointmentId: string): Promise<any> {
    try {
      const response = await this.userRepositary.cancelAppointment(
        appointmentId
      );

      if (response) {
        const paymentId = response.paymentId;

        if (paymentId) {
          const paymentDetails = await razorpay.payments.fetch(paymentId);
          console.log("Payment Details:", paymentDetails);
          const captureResponse = await razorpay.payments.capture(
            paymentId,
            response.fees * 100,
            "INR"
          );
          console.log("Payment Captured:", captureResponse);
          const refundOptions = {
            amount: response.fees * 100,
            speed: "normal",
            notes: {
              reason: "Appointment canceled",
            },
          };

          // Call Razorpay's refund API
          const refund = await razorpay.payments.refund(
            paymentId,
            refundOptions
          );
          console.log("refund was successful : ", refund);
          return response;
        } else {
          throw new Error("No payment ID available for refund");
        }
      }
    } catch (error: any) {
      console.error("Error in cancelAppointment:", error);
      throw new Error(`Failed to cancel appointment: ${error.message}`);
    }
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<any> {
    const user = await this.userRepositary.getUserById(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error("Current password is incorrect.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepositary.updatePassword(userId, hashedPassword);
  }
}
