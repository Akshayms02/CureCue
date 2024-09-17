import { IUserRepository } from "../interfaces/IUserRepository";
import { IUser } from "../models/userModel";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import redisClient from "../utils/redisCaching";
import sendEmailOtp from "../config/nodemailer";
import { AwsConfig } from "../config/awsConfig";
import { createToken } from "../config/jwtConfig";
import jwt from "jsonwebtoken";

export class userServices {
  constructor(
    private userRepositary: IUserRepository,
    private S3Service: AwsConfig
  ) {}

  async registeUser(userData: IUser): Promise<void | boolean> {
    try {
      console.log("hello from services");
      const existingUser = await this.userRepositary.existUser(userData.email);
      if (existingUser) {
        throw Error("Email already in use");
      }
      console.log(existingUser);

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
      console.log(`tempUserData${userData.email}`);
      await redisClient.setEx(
        `tempUserData${userData.email}`,
        400,
        JSON.stringify(tempUserData)
      );
      const ttl = await redisClient.ttl(`tempUserData${userData.email}`);
      console.log("TTL:", ttl); // Should be close to 300 seconds

      const otp = Math.floor(1000 + Math.random() * 9000).toString();

      await redisClient.setEx(userData.email, 60, otp);
      console.log("otp : ", otp);

      sendEmailOtp(userData.email, otp);

      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(
          `Error has occured in UserServices register:${error.message}`
        );
      } else {
        console.log("An unknown error has occured");
      }
    }
  }

  async otpVerify(email: string, inputOtp: string): Promise<boolean> {
    try {
      const cachedOtp = await redisClient.get(email);
      console.log("Catched OTP: ", cachedOtp);
      if (!cachedOtp) {
        throw new Error("OTP Expired or not found");
      } else if (cachedOtp !== inputOtp) {
        throw new Error("Wrong OTP");
      } else {
        const tempUserData = await redisClient.get(`tempUserData${email}`);
        console.log(`tempUserData${email}`, tempUserData);
        if (!tempUserData) {
          throw new Error("Temporary userData not found or Expired");
        }

        const userData = JSON.parse(tempUserData);
        await this.userRepositary.createUser(userData);

        await redisClient.del(email);
        await redisClient.del(`tempUserData${email}`);

        return true;
      }
    } catch (error: unknown) {
      console.log(error);
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
      const user = await this.userRepositary.userLoginValidate(email, password);
      if (!user) {
        throw new Error("Invalid Login Credentails");
      }
      const accessToken = createToken(user.userId as string);

      const refreshToken = jwt.sign(
        { id: user.userId, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      const userInfo = {
        name: user.name,
        email: user.email,
        userId: user.userId,
        phone: user.phone,
        isBlocked: user.isBlocked,
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

      console.log("Resend generated OTP:", otp);

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
