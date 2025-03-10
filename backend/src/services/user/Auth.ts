import { createRefreshToken, createToken } from "../../config/jwtConfig";
import sendEmailOtp from "../../config/nodemailer";
import { IAuthRepository } from "../../interfaces/user/Auth.repository.interface";
import { IAuthService } from "../../interfaces/user/Auth.service.interface";
import { IUser } from "../../models/userModel";
import redisClient from "../../utils/redisCaching";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";


export class AuthService implements IAuthService {
    private AuthRepository: IAuthRepository;
    constructor(AuthRepository: IAuthRepository) {
        this.AuthRepository = AuthRepository
    }

    async registeUser(userData: IUser): Promise<void | boolean> {
        try {
            const existingUser = await this.AuthRepository.existUser(userData.email);
            if (existingUser) {
                throw Error("Email already in use");
            }

            const saltRounds: number = 10;
            const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

            const userId = uuidv4();
            const tempUserData = {
                userId: userId,
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                password: hashedPassword,
                createdAt: new Date(),
            };

            await redisClient.setEx(
                `tempUserData${userData.email}`,
                400,
                JSON.stringify(tempUserData)
            );

            const otp = Math.floor(1000 + Math.random() * 9000).toString();

            await redisClient.setEx(userData.email, 60, otp);

            sendEmailOtp(userData.email, otp);

            return true;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(
                    `Error has occured in UserServices register:${error.message}`
                );
            } else {
                throw new Error("Unknown Error");
            }
        }
    }

    async otpVerify(email: string, inputOtp: string): Promise<boolean> {
        try {
            const cachedOtp = await redisClient.get(email);

            if (!cachedOtp) {
                throw new Error("OTP Expired or not found");
            } else if (cachedOtp !== inputOtp) {
                throw new Error("Wrong OTP");
            } else {
                const tempUserData = await redisClient.get(`tempUserData${email}`);

                if (!tempUserData) {
                    throw new Error("Temporary userData not found or Expired");
                }

                const userData = JSON.parse(tempUserData);
                await this.AuthRepository.createUser(userData);

                await redisClient.del(email);
                await redisClient.del(`tempUserData${email}`);

                return true;
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error("unknown error has occured");
            }
        }
    }

    async verifyLogin(
        email: string,
        password: string
    ): Promise<{
        userInfo: { name: string; email: string };
        accessToken: string;
        refreshToken: string;
    }> {
        try {
            const user = await this.AuthRepository.userLoginValidate(email, password);
            if (!user) {
                throw new Error("Invalid Login Credentails");
            }
            const accessToken = createToken(user.userId as string, "user");

            const refreshToken = createRefreshToken(user.userId as string, "user");

            const userInfo = {
                name: user.name,
                email: user.email,
                userId: user.userId,
                phone: user.phone,
                isBlocked: user.isBlocked,
                DOB: user.DOB,
                gender: user.gender,
            };



            return { userInfo, accessToken, refreshToken };
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`${error.message}`);
            } else {
                throw new Error("Unknown Error Occured from UserServices");
            }
        }
    }

    async resendOtp(email: string): Promise<boolean> {
        try {
            const otp = Math.floor(1000 + Math.random() * 9000).toString();

            await redisClient.setEx(email, 60, otp);

            sendEmailOtp(email, otp);

            return true;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error(
                    "An unknow Error has occured in UserServices resendOtp"
                );
            }
        }
    }
}