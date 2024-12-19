import { IAdmin } from "../../models/adminModel";

export interface IAuthRepository {
  adminCheck(email: string): Promise<IAdmin>;
}
