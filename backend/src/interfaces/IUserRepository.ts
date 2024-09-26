import { IUser } from "../models/userModel";

export interface IUserRepository {
  existUser(email: string): Promise<IUser | null>;
  createUser(userData: IUser): Promise<IUser>;
  userLoginValidate(email: string, password: string): Promise<IUser>;
  getDoctors(): Promise<any>;
}
