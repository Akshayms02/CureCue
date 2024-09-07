import { IUserRepositary } from "../interfaces/IUserRepositary";
import userModel, { IUser } from "../models/userModel";

export class UserRepositary implements IUserRepositary {
  async existUser(email: string): Promise<IUser | null> {
    console.log("hello from userRepositary");
    return await userModel.findOne({ email });
  }

  async createUser(userData: IUser): Promise<IUser> {
    try {
      console.log("Creating new user with :", userData);
      const newUser = new userModel(userData);
      return await newUser.save();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error creating a new user: ${error.message}`);
      } else {
        throw new Error("Unknown error has occured");
      }
    }
  }
}
