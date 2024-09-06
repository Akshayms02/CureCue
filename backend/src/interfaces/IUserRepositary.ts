import { IUser } from "../models/userModel";

export interface IUserRepositary {
  existUser(email: string): Promise<IUser | null>;
  createUser(userData: IUser): Promise<IUser>;
}
