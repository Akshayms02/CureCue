import { IUserRepositary } from "../interfaces/IUserRepositary";
import userModel, { IUser } from "../models/userModel";

export class UserRepositary implements IUserRepositary {
  async existUser(email: string): Promise<IUser | null> {
    console.log("hello from userRepositary")
    return await userModel.findOne({ email });
  }

  async createUser(userData: IUser): Promise<IUser> {
    console.log("hello from userRepository2")
    return userData;
  }
}
