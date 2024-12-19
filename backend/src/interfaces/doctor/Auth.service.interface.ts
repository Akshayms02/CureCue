import { IDoctor } from "../../models/doctorModel";

export interface IAuthService {
  registeUser(userData: IDoctor): Promise<void | boolean>;

  otpVerify(email: string, inputOtp: string): Promise<boolean>;

  resendOtp(email: string): Promise<boolean>;

  verifyLogin(
    email: string,
    password: string
  ): Promise<{
    doctorInfo: { name: string; email: string };
    docaccessToken: string;
    refreshToken: string;
  }>;
}
