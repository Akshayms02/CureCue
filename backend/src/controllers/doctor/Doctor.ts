import { Request, Response } from "express";
import { IDoctorService } from "../../interfaces/doctor/Doctor.service.interface";
import { DoctorFiles } from "../../interfaces/doctorInterfaces";
import HTTP_statusCode from "../../enums/HTTPstatusCode";


export class DoctorController {
    private DoctorService: IDoctorService;

    constructor(DoctorService: IDoctorService) {
        this.DoctorService = DoctorService
    }

    async updateDoctorProfileImage(req:Request,res:Response):Promise<void>{
        try {
            const doctorId=req.body.doctorId
            const response= this.DoctorService.updateDoctorImage(doctorId,req.file);
            res
            .status(HTTP_statusCode.OK)
            .json({ message: "Profile image updated successfully", response });
        } catch (error:any) {
            if (error.message.includes("Failed to update image")) {
                res.status(HTTP_statusCode.BadRequest).json({
                    success: false,
                    message: `Failed to get wallet details: ${error.message}`,
                });
            } else {
                res
                    .status(HTTP_statusCode.InternalServerError)
                    .json({ success: false, message: "An unexpected error occurred." });
            }
        }
    }

    async getWallet(req: Request, res: Response): Promise<void> {
        try {
            const doctorId = req.params.doctorId;
            const { status, page = 1, limit = 10 } = req.query; // Default page 1, limit 10

            if (!doctorId) {
                res.status(HTTP_statusCode.BadRequest).json({ message: "Doctor ID is required." });
                return;
            }

            const response = await this.DoctorService.getWallet(
                doctorId,
                status as string,
                parseInt(page as string, 10),
                parseInt(limit as string, 10)
            );

            res.status(HTTP_statusCode.OK).json({
                success: true,
                message: "Wallet data fetched successfully",
                response,
            });
        } catch (error: any) {
            console.error("Error fetching wallet data:", error.message);

            if (error.message.includes("Failed to get wallet details")) {
                res.status(HTTP_statusCode.BadRequest).json({
                    success: false,
                    message: `Failed to get wallet details: ${error.message}`,
                });
            } else {
                res
                    .status(HTTP_statusCode.InternalServerError)
                    .json({ success: false, message: "An unexpected error occurred." });
            }
        }
    }

    async uploadDoctorDetails(req: Request, res: Response): Promise<void> {
        try {
            
            const response = await this.DoctorService.uploadDoctorData(
                req.body,
                req.files as DoctorFiles
            );

            if (response) {
                
                res.status(HTTP_statusCode.OK).json(response);
            } else {
                res.status(HTTP_statusCode.BadRequest).json({ message: "Something went wrong" });
            }
        } catch (error: any) {
            res.status(HTTP_statusCode.BadRequest).json({ message: `Invalid file format : ${error}` });
        }
    }

    async withdraw(req: Request, res: Response): Promise<void> {
        try {
            const doctorId = req.params.doctorId;
            const withdrawalAmount = req.body.withdrawAmount;
            
            
            

            if (!doctorId) {
                res
                    .status(HTTP_statusCode.BadRequest)
                    .json({ success: false, message: "Doctor ID is required." });
                return;
            }
            if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
                res.status(HTTP_statusCode.BadRequest).json({
                    success: false,
                    message: "A valid withdrawal amount is required.",
                });
                return;
            }

            const response = await this.DoctorService.withdraw(
                doctorId,
                withdrawalAmount
            );

            res
                .status(HTTP_statusCode.OK)
                .json({ success: true, message: "Withdrawal successful", response });
        } catch (error: any) {
            console.error("Error fetching wallet data:", error.message);

            if (error.message.includes("Failed to get wallet details")) {
                res.status(HTTP_statusCode.BadRequest).json({
                    success: false,
                    message: `Failed to get wallet details: ${error.message}`,
                });
            } else {
                res
                    .status(HTTP_statusCode.InternalServerError)
                    .json({ success: false, message: "An unexpected error occurred." });
            }
        }
    }

    async getDoctorData(req: Request, res: Response): Promise<void> {
        try {
            const { doctorId } = req.params;
            const response = await this.DoctorService.getDoctorData(
                doctorId as string
            );
            
            if (response) {
                res.status(HTTP_statusCode.OK).json(response);
            }
        } catch (error: any) {
            if (error instanceof Error) {
                
                res.status(HTTP_statusCode.InternalServerError).json({ message: "Internal server Error" });
            }
        }
    }

    async getDashboardData(req: Request, res: Response): Promise<void> {
        try {
            const doctorId = req.query.doctorId;
            const response = await this.DoctorService.getDashboardData(
                doctorId as string
            );

            res
                .status(HTTP_statusCode.OK)
                .json({ message: "Dashboard data retrieved successfully", response });
        } catch (error: any) {
            console.error("Error in getDashboardData controller:", error.message);

            if (
                error.message ===
                "Something went wrong while retrieving dashboard data."
            ) {
                res.status(HTTP_statusCode.BadRequest).json({ message: "Failed to retrieve dashboard data." });
            } else {
                res.status(HTTP_statusCode.InternalServerError).json({
                    message: "An unexpected error occurred",
                    error: error.message,
                });
            }
        }
    }


    async updateDoctorProfile(req: Request, res: Response): Promise<void> {
        try {
            const { doctorId, fees, gender, phone } = req.body;
            

            const response = await this.DoctorService.updateProfile({
                doctorId,
                fees,
                gender,
                phone,
            });

            res
                .status(HTTP_statusCode.OK)
                .json({ message: "Profile updated successfully", response });
        } catch (error: any) {
            console.error("Error updating profile:", error.message);

            if (error.message.includes("something went wrong")) {
                res.status(HTTP_statusCode.BadRequest).json({ message: "Error updating profile." });
            } else {
                res.status(HTTP_statusCode.InternalServerError).json({
                    message: "An unexpected error occurred",
                    error: error.message,
                });
            }
        }
    }

    async checkStatus(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.params;
            const response = await this.DoctorService.checkStatus(email as string);

            res.status(HTTP_statusCode.OK).json(response);
        } catch (error: any) {
            if (error instanceof Error) {
                
                res.status(HTTP_statusCode.InternalServerError).json({ message: "Internal Server Error" });
            }
        }
    }


}