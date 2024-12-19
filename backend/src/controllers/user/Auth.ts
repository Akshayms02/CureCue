import { Request, Response } from "express";
import { IAuthService } from "../../interfaces/user/Auth.service.interface";
import { cookieSettings } from "../../config/cookieConfig";
import HTTP_statusCode from "../../enums/HTTPstatusCode";


export class AuthController {
    private AuthService: IAuthService;

    constructor(AuthService: IAuthService) {
        this.AuthService = AuthService
    }

    async register(req: Request, res: Response): Promise<any> {
        try {
            const user = await this.AuthService.registeUser(req.body);
            res.status(HTTP_statusCode.updated).json(user);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(HTTP_statusCode.BadRequest).json({ message: error.message });
            } else {
                res.status(HTTP_statusCode.BadRequest).json({ message: "An unknow error has occured" });
            }
        }
    }
    async verifyOtp(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body;

            await this.AuthService.otpVerify(data.email, data.otp);
            res.status(HTTP_statusCode.OK).json({ message: "verified" });
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error("somekind of error");
            } else {
                throw new Error("Unknown error has occured");
            }
        }
    }
    async verifyLogin(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const result = await this.AuthService.verifyLogin(email, password);
            if (!result) {
                res.status(401).json({ message: "Invalid Login Credentials" });
            }
            res.cookie("refreshToken", result.refreshToken, cookieSettings);

            const { accessToken, userInfo } = result;
            const Credentials = { accessToken, userInfo };
            res.status(HTTP_statusCode.OK).json({ message: "Login Successful", Credentials });
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message === "User doesnt Exist") {
                    res.status(HTTP_statusCode.BadRequest).json({ message: "User Doesnt Exist" });
                } else if (error.message === "User is blocked") {
                    res.status(HTTP_statusCode.BadRequest).json({ message: "User is blocked" });
                } else if (error.message === "Invalid Password") {
                    res.status(HTTP_statusCode.BadRequest).json({ message: "Password is wrong" });
                } else {
                    res.status(HTTP_statusCode.InternalServerError).json({ message: "Internal Server Error" });
                }
            }
        }
    }

    async resendOtp(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            const result = await this.AuthService.resendOtp(email);
            res.status(HTTP_statusCode.OK).json({
                success: true,
                message: "OTP has been resent successfully.",
                result,
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(
                    `Error happened in userController resendOTP: ${error.message}`
                );
            } else {
                throw new Error(
                    "An unknow error has occured in resendOtp userController"
                );
            }
        }
    }

    async logoutUser(req: Request, res: Response): Promise<void> {
        try {
            res.clearCookie("refreshToken", {
                httpOnly: true,
                path: "/", // Ensure the cookie is cleared site-wide
                sameSite: "strict",
            });
            res
                .status(HTTP_statusCode.OK)
                .json({ message: "You have been logged Out Successfully" });
        } catch (error: any) {
            res.status(HTTP_statusCode.InternalServerError).json({
                message: `Internal server error : ${error}`,
            });
        }
    }

}