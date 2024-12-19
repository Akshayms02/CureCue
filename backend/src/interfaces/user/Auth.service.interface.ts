import { IUser } from "../../models/userModel";



export interface IAuthService {
    registeUser(userData: IUser): Promise<void | boolean>;
    otpVerify(email: string, inputOtp: string): Promise<boolean>;
    verifyLogin(
        email: string,
        password: string
    ): Promise<{
        userInfo: { name: string; email: string };
        accessToken: string;
        refreshToken: string;
    }>;
    resendOtp(email: string): Promise<boolean>;

};