import { IDoctor } from "../../models/doctorModel";


export interface IAuthRepository {
  existUser(email: string): Promise<IDoctor | null>;

  createUser(userData: IDoctor): Promise<IDoctor>;

  userLoginValidate(email: string, password: string): Promise<IDoctor>;


}
