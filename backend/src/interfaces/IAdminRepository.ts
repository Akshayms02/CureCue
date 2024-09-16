import { IAdmin } from "../models/adminModel";

export interface IAdminRepository {
  verifyAdmin(email: string, password: string): Promise<IAdmin>;
  createUser(userData: IAdmin): Promise<IAdmin>;
  userLoginValidate(email: string, password: string): Promise<IAdmin>;
}
