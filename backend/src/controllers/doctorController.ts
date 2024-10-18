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
      console.log(response)
      if (response) {
        res.status(200).json(response);
      }
    } catch (error: any) {
      if (error instanceof Error) {
        console.log(error)
        res.status(500).json({ message: "Internal server Error" });
      }
    }
  }
}
