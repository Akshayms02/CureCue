import { Request, Response } from "express";
import { IUserService } from "../../interfaces/user/User.service.interface";


export class UserController {
    private UserService: IUserService;

    constructor(UserService: IUserService) {
        this.UserService = UserService
    }

    async getSpecializations(req: Request, res: Response): Promise<void> {
        try {
            console.log("get specializations reached");
            const page = parseInt(req.query.page as string, 10) || 1;
            const limit = parseInt(req.query.limit as string, 10) || 10;

            const response = await this.UserService.getSpecialization(page, limit);

            console.log(response);
            res.status(200).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to fetch specializations" });
        }
    }

    async getDepDoctors(req: Request, res: Response): Promise<void> {
        try {
            const { departmentId } = req.query;
            const response = await this.UserService.getDepDoctors(
                departmentId as string
            );
            console.log(response);

            res.status(200).json(response);
        } catch (error: any) {
            if (error instanceof Error) {
                res.status(500).json({ message: "Internal Server Error" });
            }
        }
    }

    async getDoctors(req: Request, res: Response): Promise<void> {
        try {
            const response = await this.UserService.getAllDoctors();
            res.status(200).json(response);
        } catch (error: any) {
            res.status(400).json({ message: `Internal Server Error:${error}` });
        }
    }


    async getDoctorData(req: Request, res: Response): Promise<void> {
        try {
            const { doctorId } = req.params;
            const response = await this.UserService.getDoctorData(doctorId as string);
            if (response) {
                res.status(200).json(response);
            }
        } catch (error: any) {
            if (error instanceof Error) {
                res.status(500).json({ message: "Internal Server Error" });
            }
        }
    }


    async updateUserProfile(req: Request, res: Response): Promise<any> {
        try {
            const { userId, name, DOB, gender, phone, email } = req.body;

            const response = await this.UserService.updateProfile({
                userId,
                name,
                DOB,
                gender,
                phone,
                email,
            });

            res
                .status(200)
                .json({ message: "Profile updated successfully", response });
        } catch (error: any) {
            console.error("Error updating profile:", error.message);

            if (error.message.includes("something went wrong")) {
                res.status(400).json({ message: "Error updating profile." });
            } else {
                res.status(500).json({
                    message: "An unexpected error occurred",
                    error: error.message,
                });
            }
        }
    }

    async changePassword(req: Request, res: Response): Promise<any> {
        const { currentPassword, newPassword, userId } = req.body;

        try {
            await this.UserService.changePassword(
                userId,
                currentPassword,
                newPassword
            );
            res.status(200).json({ message: "Password changed successfully." });
        } catch (error: any) {
            res
                .status(400)
                .json({ message: error.message || "Failed to change password." });
        }
    }

    async getReviews(req: Request, res: Response): Promise<void> {
        try {
            const doctorId = req.params.doctorId;

            const response = await this.UserService.getReviewData(doctorId);

            res.status(200).json({ message: "successfully", response });
        } catch (error: any) {
            if (
                error.message ===
                "Something went wrong while creating the specialization."
            ) {
                res.status(400).json({
                    message: "Something went wrong while creating the specialization.",
                });
            } else {
                console.log(error);
                res.status(500).json({
                    message: "An unexpected error occurred",
                    error: error.message,
                });
            }
        }
    }

    async checkStatus(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.params;
            const response = await this.UserService.checkStatus(email);
            if (response) {
                res.status(200).json({ isBlocked: response.isBlocked });
            }
        } catch (error: any) {
            res.status(400).json({ message: `Something went wrong:${error}` });
        }
    }

}