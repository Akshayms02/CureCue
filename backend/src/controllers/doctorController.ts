import { Request, Response } from "express";
import { doctorServices } from "../services/doctorServices";

interface FileData {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: any;
  size: number;
}
interface DoctorFiles {
  image?: FileData[];
  aadhaarFrontImage?: FileData[];
  aadhaarBackImage?: FileData[];
  certificateImage?: FileData[];
  qualificationImage?: FileData[];
}
export interface docDetails {
  profileUrl: {
    type: string;
    url: string;
  };
  aadhaarFrontImageUrl: {
    type: string;
    url: string;
  };
  aadhaarBackImageUrl: {
    type: string;
    url: string;
  };
  certificateUrl: {
    type: string;
    url: string;
  };
  qualificationUrl: {
    type: string;
    url: string;
  };
}
export default class DoctorController {
  private doctorService: doctorServices;
  constructor(doctorService: doctorServices) {
    this.doctorService = doctorService;
  }

  async register(req: Request, res: Response) {
    try {
      const user = await this.doctorService.registeUser(req.body);
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

      await this.doctorService.otpVerify(data.email, data.otp);
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
      const result = await this.doctorService.verifyLogin(email, password);
      if (!result) {
        res.status(401).json({ message: "Invalid Login Credentials" });
      }
      res.cookie("docrefreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      const { docaccessToken, doctorInfo } = result;

      const Credentials = { docaccessToken, doctorInfo };
      res.status(200).json({ message: "Login Successful", Credentials });
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === "User doesnt Exist") {
          res.status(400).json({ message: "User Doesnt Exist" });
        } else if (error.message === "Invalid Password") {
          res.status(400).json({ message: "Password is wrong" });
        } else if (error.message === "User is blocked") {
          res.status(403).json({ message: "User is Blocked" });
        }
      } else {
        throw new Error(
          "Unknown Error has Occured in DoctorController verify login"
        );
      }
    }
  }

  async doctorLogout(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("docrefreshToken", {
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

  async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const result = await this.doctorService.resendOtp(email);
      res.status(200).json({
        success: true,
        message: "OTP has been resent successfully.",
        result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(
          `Error happened in DoctorController resendOTP: ${error.message}`
        );
      } else {
        throw new Error(
          "An unknow error has occured in resendOtp DoctorController"
        );
      }
    }
  }

  async uploadDoctorDetails(req: Request, res: Response): Promise<void> {
    try {
      console.log("hellop");
      const response = await this.doctorService.uploadDoctorData(
        req.body,
        req.files as DoctorFiles
      );

      if (response) {
        console.log(response);
        res.status(200).json(response);
      } else {
        res.status(400).json({ message: "Something went wrong" });
      }
    } catch (error: any) {
      res.status(400).json({ message: `Invalid file format : ${error}` });
    }
  }

  async checkStatus(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;
      const response = await this.doctorService.checkStatus(email as string);

      res.status(200).json(response);
    } catch (error: any) {
      if (error instanceof Error) {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  async scheduleSlots(req: Request, res: Response): Promise<void> {
    try {
      const { date, timeSlots, doctorId } = req.body;
      if (!doctorId || !date || !timeSlots || timeSlots.length === 0) {
        res
          .status(400)
          .json({ message: "Doctor ID, date, and time slots are required." });
      }
      const response = await this.doctorService.scheduleSlot(
        date,
        timeSlots,
        doctorId
      );

      if (response) {
        res.status(200).json({
          message: "Successful",
        });
      } else {
        res.status(500).json({ message: "Something went wrong" });
      }
    } catch (error: any) {
      if (error instanceof Error) {
        if (error.message == "Some of the slots here are already scheduled") {
          res.status(409).json({
            message: "Some of the requested slots are already scheduled.",
          });
        } else {
          res.status(500).json({ message: "Internal Server Error" });
        }
      }
    }
  }

  async checkAvialableSlots(req: Request, res: Response): Promise<void> {
    try {
      const { doctorId, date } = req.query;

      const response = await this.doctorService.checkSlots(
        doctorId as string,
        date as string
      );

      if (response) {
        res.status(200).json(response);
      }
    } catch (error: any) {
      if (error instanceof Error) {
        if (error.message === "No slots on this date Exists") {
          res.status(204).json({ message: "No slots found" });
        } else {
          res.status(500).json({ message: "Internal Server Error" });
        }
      }
    }
  }

  async deleteSlot(req: Request, res: Response): Promise<void> {
    try {
      const { start, doctorId, date } = req.body;
      console.log(date);
      const response = await this.doctorService.deleteSlot(
        start as string,
        doctorId as string,
        date as string
      );
      if (response) {
        res.status(200).json({ message: "Slot successfully deleted" });
      }
    } catch (error: any) {
      if (error instanceof Error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  async checkAvialability(req: Request, res: Response): Promise<void> {
    const { doctorId, date, start, end } = req.body;
    if (!doctorId || !date || !start || !end) {
      res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const response = await this.doctorService.checkAvialability(
        doctorId as string,
        date as string,
        start as string,
        end as string
      );
      if (response) {
        res.status(200).json(response);
      }
    } catch (error: any) {
      if (error instanceof Error) {
        console.log(error);
        res.status(500).json({ message: "Internal server Error" });
      }
    }
  }

  async getDoctorData(req: Request, res: Response): Promise<void> {
    try {
      const { doctorId } = req.params;
      const response = await this.doctorService.getDoctorData(
        doctorId as string
      );
      console.log(response);
      if (response) {
        res.status(200).json(response);
      }
    } catch (error: any) {
      if (error instanceof Error) {
        console.log(error);
        res.status(500).json({ message: "Internal server Error" });
      }
    }
  }

  async getAppointments(req: Request, res: Response): Promise<any> {
    const doctorId = req.params.doctorId;

    try {
      const appointments = await this.doctorService.getAppointments(doctorId);
      res.status(200).json(appointments);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error fetching appointments", error: error.message });
    }
  }

  async updateDoctorProfile(req: Request, res: Response): Promise<void> {
    try {
      const { doctorId, fees, gender, phone } = req.body;
      console.log(req.body);

      const response = await this.doctorService.updateProfile({
        doctorId,
        fees,
        gender,
        phone,
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

  async getDashboardData(req: Request, res: Response): Promise<void> {
    try {
      const doctorId = req.query.doctorId;
      const response = await this.doctorService.getDashboardData(
        doctorId as string
      );

      res
        .status(200)
        .json({ message: "Dashboard data retrieved successfully", response });
    } catch (error: any) {
      console.error("Error in getDashboardData controller:", error.message);

      if (
        error.message ===
        "Something went wrong while retrieving dashboard data."
      ) {
        res.status(400).json({ message: "Failed to retrieve dashboard data." });
      } else {
        res.status(500).json({
          message: "An unexpected error occurred",
          error: error.message,
        });
      }
    }
  }

  async addPrescription(req: Request, res: Response): Promise<any> {
    try {
      const { appointmentId, prescription } = req.body;

      console.log("Received appointmentId:", appointmentId);
      console.log("Received prescription:", prescription);

      const response = await this.doctorService.addPrescription(
        appointmentId,
        prescription
      );

      console.log("Add Prescription Response:", response);

      res
        .status(200)
        .json({ message: "Prescription added successfully", data: response });
    } catch (error: any) {
      console.error("Error adding prescription:", error.message);

      if (error.message.includes("Failed to add prescription")) {
        res
          .status(400)
          .json({ message: `Failed to add prescription: ${error.message}` });
      } else {
        res.status(500).json({
          message: "An unexpected error occurred",
          error: error.message,
        });
      }
    }
  }

  async getWallet(req: Request, res: Response): Promise<void> {
    try {
      const doctorId = req.params.doctorId;
      const { status, page = 1, limit = 10 } = req.query; // Default page 1, limit 10

      if (!doctorId) {
        res.status(400).json({ message: "Doctor ID is required." });
        return;
      }

      const response = await this.doctorService.getWallet(
        doctorId,
        status as string,
        parseInt(page as string, 10),
        parseInt(limit as string, 10)
      );

      res.status(200).json({
        success: true,
        message: "Wallet data fetched successfully",
        response,
      });
    } catch (error: any) {
      console.error("Error fetching wallet data:", error.message);

      if (error.message.includes("Failed to get wallet details")) {
        res.status(400).json({
          success: false,
          message: `Failed to get wallet details: ${error.message}`,
        });
      } else {
        res
          .status(500)
          .json({ success: false, message: "An unexpected error occurred." });
      }
    }
  }
  async withdraw(req: Request, res: Response): Promise<void> {
    try {
      const doctorId = req.params.doctorId;
      const withdrawalAmount = req.body.withdrawAmount;
      console.log(req.body);
      console.log(withdrawalAmount);
      console.log(typeof withdrawalAmount);

      if (!doctorId) {
        res
          .status(400)
          .json({ success: false, message: "Doctor ID is required." });
        return;
      }
      if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
        res.status(400).json({
          success: false,
          message: "A valid withdrawal amount is required.",
        });
        return;
      }

      const response = await this.doctorService.withdraw(
        doctorId,
        withdrawalAmount
      );

      res
        .status(200)
        .json({ success: true, message: "Withdrawal successful", response });
    } catch (error: any) {
      console.error("Error fetching wallet data:", error.message);

      if (error.message.includes("Failed to get wallet details")) {
        res.status(400).json({
          success: false,
          message: `Failed to get wallet details: ${error.message}`,
        });
      } else {
        res
          .status(500)
          .json({ success: false, message: "An unexpected error occurred." });
      }
    }
  }
  async cancelAppointment(req: Request, res: Response): Promise<any> {
    try {
      const { appointmentId, reason } = req.body;
      const response = this.doctorService.cancelAppointment(
        appointmentId,
        reason
      );
      res
        .status(200)
        .json({ message: "Appointment has been cancelled", data: response });
    } catch (error: any) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "An unexpected error has occured" });
    }
  }
}
