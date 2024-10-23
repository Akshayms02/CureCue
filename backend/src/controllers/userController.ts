import { Request, Response } from "express";
import { userServices } from "../services/userServices";

export default class UserController {
  private userService: userServices;
  constructor(userService: userServices) {
    this.userService = userService;
  }

  async register(req: Request, res: Response) {
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
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

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
      const response = await this.userService.getSpecialization();

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

  async createAppointment(req: Request, res: Response) {
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

  async holdSlot(req: Request, res: Response) {
    const { doctorId, date, startTime, userId } = req.body;
    console.log(req.body);

    try {
      const checkHold = await this.userService.checkHold(
        doctorId,
        new Date(date),
        new Date(startTime)
      );
      if (checkHold) {
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
}
