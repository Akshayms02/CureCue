import { Request, Response } from "express";
import { userServices } from "../services/userServices";

export default class UserController {
  private userService: userServices;
  constructor(userService: userServices) {
    this.userService = userService;
  }

  async register(req: Request, res: Response) {
    try {
      console.log("hello from controller");
      const user = await this.userService.registeUser(req.body);
      res.status(201).json(user);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("error has occured here");
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: "An unknow error has occured" });
      }
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      console.log("userdata: ", data);
      await this.userService.otpVerify(data.email, data.otp);
      res.status(200).json({ message: "verified" });
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof Error) {
        throw new Error("somekind of error");
      } else {
        throw new Error("Unknown error has occured");
      }
    }
  }

  async verifyLogin(req: Request, res: Response): Promise<void> {
    try {
     console.log("hello")
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
        console.log(error)
        if (error.message === "User doesnt Exist") {
          res.status(400).json({ message: "User Doesnt Exist" });
        } else if (error.message === "Invalid Password") {
          res.status(400).json({ message: "Password is wrong" });
        } else {
          throw new Error(
            "Unknown Error has Occured in UserController verify login"
          );
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
}
