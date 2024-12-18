import { Request, Response } from "express";
import { userServices } from "../services/userServices";
import { IUserController } from "../interfaces/IUserController";
import { cookieSettings } from "../config/cookieConfig";

export default class UserController implements IUserController {
  private userService: userServices;
  constructor(userService: userServices) {
    this.userService = userService;
  }

  async register(req: Request, res: Response): Promise<any> {
    try {
      const user = await this.userService.registeUser(req.body);
      res.status(201).json(user);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: "An unknow error has occured" });
      }
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;

      await this.userService.otpVerify(data.email, data.otp);
      res.status(200).json({ message: "verified" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error("somekind of error");
      } else {
        throw new Error("Unknown error has occured");
      }
    }
  }

  async verifyLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await this.userService.verifyLogin(email, password);
      if (!result) {
        res.status(401).json({ message: "Invalid Login Credentials" });
      }
      res.cookie("refreshToken", result.refreshToken, cookieSettings);

      const { accessToken, userInfo } = result;
      const Credentials = { accessToken, userInfo };
      res.status(200).json({ message: "Login Successful", Credentials });
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === "User doesnt Exist") {
          res.status(400).json({ message: "User Doesnt Exist" });
        } else if (error.message === "User is blocked") {
          res.status(400).json({ message: "User is blocked" });
        } else if (error.message === "Invalid Password") {
          res.status(400).json({ message: "Password is wrong" });
        } else {
          res.status(500).json({ message: "Internal Server Error" });
        }
      }
    }
  }

  async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const result = await this.userService.resendOtp(email);
      res.status(200).json({
        success: true,
        message: "OTP has been resent successfully.",
        result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(
          `Error happened in userController resendOTP: ${error.message}`
        );
      } else {
        throw new Error(
          "An unknow error has occured in resendOtp userController"
        );
      }
    }
  }
  async checkStatus(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;
      const response = await this.userService.checkStatus(email);
      if (response) {
        res.status(200).json({ isBlocked: response.isBlocked });
      }
    } catch (error: any) {
      res.status(400).json({ message: `Something went wrong:${error}` });
    }
  }
  async logoutUser(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        path: "/", // Ensure the cookie is cleared site-wide
        sameSite: "strict",
      });
      res
        .status(200)
        .json({ message: "You have been logged Out Successfully" });
    } catch (error: any) {
      res.status(500).json({
        message: `Internal server error : ${error}`,
      });
    }
  }
  async getDoctors(req: Request, res: Response): Promise<void> {
    try {
      const response = await this.userService.getAllDoctors();
      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ message: `Internal Server Error:${error}` });
    }
  }
  async getSpecializations(req: Request, res: Response): Promise<void> {
    try {
      console.log("get specializations reached");
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const response = await this.userService.getSpecialization(page, limit);

      console.log(response);
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch specializations" });
    }
  }

  async getDepDoctors(req: Request, res: Response): Promise<void> {
    try {
      const { departmentId } = req.query;
      const response = await this.userService.getDepDoctors(
        departmentId as string
      );
      console.log(response);

      res.status(200).json(response);
    } catch (error: any) {
      if (error instanceof Error) {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  async getDoctorData(req: Request, res: Response): Promise<void> {
    try {
      const { doctorId } = req.params;
      const response = await this.userService.getDoctorData(doctorId as string);
      if (response) {
        res.status(200).json(response);
      }
    } catch (error: any) {
      if (error instanceof Error) {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }
  async getSlots(req: Request, res: Response): Promise<void> {
    try {
      const { doctorId, date } = req.params;
      const response = await this.userService.getSlots(
        doctorId as string,
        date as string
      );
      if (response) {
        res.status(200).json(response);
      }
    } catch (error: any) {
      if (error instanceof Error) {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  async createAppointment(req: Request, res: Response): Promise<any> {
    try {
      const {
        amount,
        currency,
        email,
        doctorId,
        userId,
        paymentId,
        orderId,
        date,
        patientName,
        timeslotId,
      } = req.body;
      const appointment = await this.userService.createAppointment({
        amount,
        currency,
        email,
        doctorId,
        userId,
        paymentId,
        orderId,
        date,
        patientName,
        timeslotId,
      });

      return res.status(201).json({
        message: "Appointment created successfully",
        appointment,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Failed to create appointment",
        error: error.message,
      });
    }
  }

  async holdSlot(req: Request, res: Response): Promise<any> {
    const { doctorId, date, startTime, userId } = req.body;
    console.log(req.body);

    try {
      const checkHold = await this.userService.checkHold(
        doctorId,
        new Date(date),
        new Date(startTime)
      );
      if (checkHold) {
        console.log(checkHold);
        if (checkHold.length > 0) {
          const timeslot = checkHold[0].timeSlots.filter((element: any) => {
            return element.start.toISOString() == startTime;
          });

          if (timeslot[0].isOnHold == true) {
            return res
              .status(400)
              .json({ success: false, message: "Failed to hold timeslot." });
          }
        }
      }
      if (!userId) {
        throw new Error("Invalid User");
      }
      const result = await this.userService.holdSlot(
        doctorId,
        new Date(date),
        new Date(startTime),
        userId
      );
      console.log(result);

      if (result) {
        return res.status(200).json({
          success: true,
          message: "Timeslot held successfully.",
          result,
        });
      } else {
        console.log("hello");
        return res
          .status(400)
          .json({ success: false, message: "Failed to hold timeslot." });
      }
    } catch (error: any) {
      console.log(error);
      if (error.message == "Invalid User") {
        return res
          .status(401)
          .json({ success: false, message: "Invalid User" });
      } else {
        return res.status(500).json({
          success: false,
          message: "Error holding timeslot.",
          error: error.message,
        });
      }
    }
  }

  async updateUserProfile(req: Request, res: Response): Promise<any> {
    try {
      const { userId, name, DOB, gender, phone, email } = req.body;

      const response = await this.userService.updateProfile({
        userId,
        name,
        DOB,
        gender,
        phone,
        email,
      });

      res
        .status(200)
        .json({ message: "Profile updated successfully", response });
    } catch (error: any) {
      console.error("Error updating profile:", error.message);

      if (error.message.includes("something went wrong")) {
        res.status(400).json({ message: "Error updating profile." });
      } else {
        res.status(500).json({
          message: "An unexpected error occurred",
          error: error.message,
        });
      }
    }
  }

  async getAllAppointments(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const { status, page = 1, limit = 5 } = req.query;

      const { appointments, totalPages } =
        await this.userService.getAppointments(
          userId,
          status as string,
          parseInt(page as string),
          parseInt(limit as string)
        );

      res.status(200).json({
        message: "Appointments fetched successfully",
        data: appointments,
        totalPages,
      });
    } catch (error: any) {
      console.error("Error fetching appointments:", error.message);

      if (error.message.includes("Failed to get appointments")) {
        res
          .status(400)
          .json({ message: `Failed to get appointments: ${error.message}` });
      } else {
        res.status(500).json({
          message: "An unexpected error occurred",
          error: error.message,
        });
      }
    }
  }

  async getAppointment(req: Request, res: Response): Promise<void> {
    try {
      const appointmentId = req.params.appointmentId;

      const response = await this.userService.getAppointment(appointmentId);

      res
        .status(200)
        .json({ message: "Appointment fetched successfully", data: response });
    } catch (error: any) {
      console.error(
        `Error fetching appointment with ID ${req.params.appointmentId}:`,
        error.message
      );

      if (error.message.includes("Failed to get appointments")) {
        res
          .status(400)
          .json({ message: `Failed to get appointments: ${error.message}` });
      } else {
        res.status(500).json({
          message: "An unexpected error occurred",
          error: error.message,
        });
      }
    }
  }
  async addReview(req: Request, res: Response): Promise<void> {
    try {
      const { appointmentId, rating, reviewText } = req.body;

      const response = await this.userService.addReview(
        appointmentId,
        rating,
        reviewText
      );

      res
        .status(200)
        .json({ message: "Review added successfully", data: response });
    } catch (error: any) {
      console.error("Error adding review:", error.message);

      if (error.message.includes("Failed to add review")) {
        res
          .status(400)
          .json({ message: `Failed to add review: ${error.message}` });
      } else {
        res.status(500).json({
          message: "An unexpected error occurred",
          error: error.message,
        });
      }
    }
  }
  async getReviews(req: Request, res: Response): Promise<void> {
    try {
      const doctorId = req.params.doctorId;

      const response = await this.userService.getReviewData(doctorId);

      res.status(200).json({ message: "successfully", response });
    } catch (error: any) {
      if (
        error.message ===
        "Something went wrong while creating the specialization."
      ) {
        res.status(400).json({
          message: "Something went wrong while creating the specialization.",
        });
      } else {
        console.log(error);
        res.status(500).json({
          message: "An unexpected error occurred",
          error: error.message,
        });
      }
    }
  }

  async cancelAppointment(req: Request, res: Response): Promise<void> {
    try {
      const appointmentId = req.params.appointmentId;

      const response = await this.userService.cancelAppointment(appointmentId);

      res
        .status(200)
        .json({
          message: "Appointment cancelled successfully",
          data: response,
        });
    } catch (error: any) {
      console.error("Error canceling appointment:", error.message);

      if (error.message.includes("Failed to cancel appointment")) {
        res
          .status(400)
          .json({ message: `Failed to cancel appointment: ${error.message}` });
      } else {
        res.status(500).json({
          message: "An unexpected error occurred",
          error: error.message,
        });
      }
    }
  }

  async changePassword(req: Request, res: Response): Promise<any> {
    const { currentPassword, newPassword, userId } = req.body;

    try {
      await this.userService.changePassword(
        userId,
        currentPassword,
        newPassword
      );
      res.status(200).json({ message: "Password changed successfully." });
    } catch (error: any) {
      res
        .status(400)
        .json({ message: error.message || "Failed to change password." });
    }
  }
}
