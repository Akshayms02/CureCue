import { IUserRepositary } from "../interfaces/IUserRepositary";
import { IUser } from "../models/userModel";

export class userServices {
  constructor(private userRepositary: IUserRepositary) {}

  async registeUser(userData: IUser): Promise<IUser> {
    console.log("hello from services")
    const existingUser = await this.userRepositary.existUser(userData.email);
    if (existingUser) {
      throw Error("User already exists");
    }

    return await this.userRepositary.createUser(userData);
  }
}
