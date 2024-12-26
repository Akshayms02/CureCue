import { IAuthRepository } from "../../interfaces/doctor/Auth.repository.interface";
import { IAuthService } from "../../interfaces/doctor/Auth.service.interface";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import redisClient from "../../utils/redisCaching";
import sendEmailOtp from "../../config/nodemailer";
import { IDoctor } from "../../models/doctorModel";
import { createRefreshToken, createToken } from "../../config/jwtConfig";
import { AwsConfig } from "../../config/awsConfig";


export class AuthService implements IAuthService {
    private AuthRepository: IAuthRepository;
    private S3Service: AwsConfig

    constructor(
        AuthRepository: IAuthRepository,
        S3Service: AwsConfig
    ) {
        this.AuthRepository = AuthRepository
        this.S3Service = S3Service;
    }

    private getFolderPathByFileType(fileType: string): string {
        switch (fileType) {
            case "profile image":
                return "cureCue/doctorProfileImages";
            case "document":
                return "cureCue/doctorDocuments";

            default:
                throw new Error(`Unknown file type: ${fileType}`);
        }
    }

    async registeUser(userData: IDoctor): Promise<void | boolean> {
        try {
            const existingUser = await this.AuthRepository.existUser(
                userData.email
            );
            if (existingUser) {
                throw Error("Email already in use");
            }

            const saltRounds: number = 10;
            const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

            const doctorId = uuidv4();
            const tempUserData = {
                doctorId: doctorId,
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                password: hashedPassword,
                createdAt: new Date(),
                kycStatus: "pending",
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
                    `Error has occured in doctorServices register:${error.message}`
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
                    "An unknow Error has occured in doctorServices resendOtp"
                );
            }
        }
    }

    async verifyLogin(
        email: string,
        password: string
    ): Promise<{
        doctorInfo: { name: string; email: string };
        docaccessToken: string;
        refreshToken: string;
    }> {
        try {
            const user = await this.AuthRepository.userLoginValidate(
                email,
                password
            );
            if (!user) {
                throw new Error("Invalid Login Credentails");
            }
            const docaccessToken = createToken(user.doctorId as string, "doctor");
            const refreshToken = createRefreshToken(
                user.doctorId as string,
                "doctor"
            );

            let imageUrl = "";

            if (user?.image) {
                const folderPath = this.getFolderPathByFileType(user?.image?.type);
                const signedUrl = await this.S3Service.getFile(
                    user.image.url,
                    folderPath
                );
                imageUrl = signedUrl;
            }

            const doctorInfo = {
                name: user.name,
                email: user.email,
                doctorId: user.doctorId,
                phone: user.phone,
                isBlocked: user.isBlocked,
                docStatus: user.kycStatus,
                DOB: user.DOB,
                fees: user.fees,
                gender: user.gender,
                department: user.department,
                image: imageUrl,
            };

            return { doctorInfo, docaccessToken, refreshToken };
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`${error.message}`);
            } else {
                throw new Error("Unknown Error Occured from doctorServices");
            }
        }
    }

    async checkStatus(
        email: string
    ): Promise<{ isBlocked: boolean; kycStatus: string } | undefined> {
        try {
            const user = await this.AuthRepository.existUser(email);
            if (!user) {
                throw new Error("User not found");
            }

            return {
                isBlocked: user.isBlocked as boolean,
                kycStatus: user.kycStatus as string,
            };
        } catch (error: any) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }

}