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
      console.log(error);
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
      console.log("userdata: ", data);
      await this.userService.otpVerify(data.email, data.otp);
      res.status(200).json({ message: "verified" });
    } catch (error: unknown) {
        console.log(error)
      if (error instanceof Error) {
        throw new Error("somekind of error");
      } else {
        throw new Error("Unknown error has occured");
      }
    }
  }
}
