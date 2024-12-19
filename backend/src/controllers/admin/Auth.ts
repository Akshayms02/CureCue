import { adminCookieSettings } from "../../config/cookieConfig";
import { IAuthService } from "../../interfaces/admin/Auth.service.interface";
import { Request, Response } from "express";

export class AuthController {
    private AuthService: IAuthService;

    constructor(AuthService: IAuthService) {
        this.AuthService = AuthService
    }
    async loginAdmin(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            const loginResponse = await this.AuthService.verifyAdmin(
                email,
                password
            );

            const response = {
                adminAccessToken: loginResponse.adminAccessToken,
                adminInfo: loginResponse.adminInfo,
            };

            res.cookie("adminRefreshToken", loginResponse.adminRefreshToken, adminCookieSettings);

            res.status(200).json({ message: "Login successful", response });
        } catch (error: any) {
            if (error.message === "Admin Doesn't exist") {
                res.status(400).json({ message: "Admin Doesn't exist" });
            }
            if (error.message === "Password is wrong") {
                res.status(400).json({ message: "Password is wrong" });
            }
            if (error.message === "Admin is Blocked") {
                res.status(400).json({ message: "Admin is Blocked" });
            }
        }
    }

    async adminLogout(req: Request, res: Response): Promise<void> {
        try {
            res.clearCookie("adminRefreshToken", {
                httpOnly: true,
                path: "/", // Ensure the cookie is cleared site-wide
                sameSite: "strict",
            });
            res
                .status(200)
                .json({ message: "You have been logged Out Successfully" });
        } catch (error: any) {
            res.status(500).json({ message: `Something went wrong:${error}` });
        }
    }

}