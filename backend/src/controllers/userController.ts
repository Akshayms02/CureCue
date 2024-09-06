import { Request, Response } from "express";
import { userServices } from "../services/userServices";


export default class UserController {
  private userService: userServices;
  constructor(userService: userServices) {
    this.userService = userService;
  }

  async register(req: Request, res: Response) {
    try {
        console.log("hello from controller")
      const user = await this.userService.registeUser(req.body);
      res.status(201).json(user);
    } catch (error: unknown) {
        console.log(error)
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: "An unknow error has occured" });
      }
    }
  }
}
