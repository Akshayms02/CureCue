import { IAdminService } from "../../interfaces/admin/Admin.service.interface";
import { Request, Response } from "express";


export class AdminController {
    private AdminService: IAdminService;

    constructor(AdminService: IAdminService) {
        this.AdminService = AdminService
    }

    async addSpecialization(req: Request, res: Response): Promise<void> {
        try {
            const { name, description } = req.body;

            const response = await this.AdminService.addSpecialization(
                name,
                description
            );

            res
                .status(200)
                .json({ message: "Specialization added successfully", response });
        } catch (error: any) {
            if (
                error.message ===
                "Something went wrong while creating the specialization."
            ) {
                res.status(400).json({
                    message: "Something went wrong while creating the specialization.",
                });
            } else {
                res.status(500).json({
                    message: "An unexpected error occurred",
                    error: error.message,
                });
            }
        }
    }

    async getSpecialization(req: Request, res: Response): Promise<void> {
        try {
            const response = await this.AdminService.getSpecialization();

            res
                .status(200)
                .json({ message: "Specialization added successfully", response });
        } catch (error: any) {
            if (
                error.message ===
                "Something went wrong while creating the specialization."
            ) {
                res.status(400).json({
                    message: "Something went wrong while creating the specialization.",
                });
            } else {
                res.status(500).json({
                    message: "An unexpected error occurred",
                    error: error.message,
                });
            }
        }
    }

    async editSpecialization(req: Request, res: Response): Promise<void> {
        try {
            const { id, name, description } = req.body;

            const response = await this.AdminService.editSpecialization(
                id,
                name,
                description
            );

            res
                .status(200)
                .json({ message: "Specialization updated successfully", response });
        } catch (error: any) {
            if (
                error.message ===
                "Something went wrong while creating the specialization."
            ) {
                res.status(400).json({
                    message: "Something went wrong while updating the specialization.",
                });
            } else {
                res.status(500).json({
                    message: "An unexpected error occurred",
                    error: error.message,
                });
            }
        }
    }

    async listUnlistSpecialization(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.body;

            const response = await this.AdminService.listUnlistSpecialization(id);

            res
                .status(200)
                .json({ message: "Specialization updated successfully", response });
        } catch (error: any) {
            if (
                error.message ===
                "Something went wrong while creating the specialization."
            ) {
                res.status(400).json({
                    message: "Something went wrong while updating the specialization.",
                });
            } else {
                res.status(500).json({
                    message: "An unexpected error occurred",
                    error: error.message,
                });
            }
        }
    }

    async getUsers(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const response = await this.AdminService.getUsers(page, limit);

            res.status(200).json({
                message: "Fetched users successfully",
                response: response.users,
                totalUsers: response.totalUsers,
                totalPages: response.totalPages,
                currentPage: response.currentPage,
            });
        } catch (error: any) {
            if (
                error.message ===
                "Something went wrong while creating the specialization."
            ) {
                res.status(400).json({
                    message: "Something went wrong while creating the specialization.",
                });
            } else {
                res.status(500).json({
                    message: "An unexpected error occurred",
                    error: error.message,
                });
            }
        }
    }

    async getDoctors(req: Request, res: Response): Promise<void> {
        try {
            const response = await this.AdminService.getDoctors();

            res.status(200).json({ message: "fetch Doctors successfully", response });
        } catch (error: any) {
            if (
                error.message ===
                "Something went wrong while creating the specialization."
            ) {
                res.status(400).json({
                    message: "Something went wrong while creating the specialization.",
                });
            } else {
                res.status(500).json({
                    message: "An unexpected error occurred",
                    error: error.message,
                });
            }
        }
    }


    async listUnlistUser(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.userId;

            const response = await this.AdminService.listUnlistUser(id);

            res.status(200).json({ message: "user updated successfully", response });
        } catch (error: any) {
            if (error.message === "Something went wrong while creating the user.") {
                res
                    .status(400)
                    .json({ message: "Something went wrong while updating the user." });
            } else {
                res.status(500).json({
                    message: "An unexpected error occurred",
                    error: error.message,
                });
            }
        }
    }




    async listUnlistDoctor(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.doctorId;

            const response = await this.AdminService.listUnlistDoctor(id);

            res
                .status(200)
                .json({ message: "Doctor updated successfully", response });
        } catch (error: any) {
            if (error.message === "Something went wrong while creating the user.") {
                res
                    .status(400)
                    .json({ message: "Something went wrong while updating the user." });
            } else {
                res.status(500).json({
                    message: "An unexpected error occurred",
                    error: error.message,
                });
            }
        }
    }
    async getAllApplications(req: Request, res: Response): Promise<void> {
        try {
            const response = await this.AdminService.getAllDoctorApplications();
            if (response) {
                res
                    .status(200)
                    .json({ message: "Data fetched successfully", response });
            }
        } catch (error: any) {
            res.status(400).json({
                message: `Something went wrong while fetching the doctors:${error}`,
            });
        }
    }

    async getDoctorApplication(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const response = await this.AdminService.getDoctorApplication(id);
            if (response) {
                res
                    .status(200)
                    .json({ message: "Details fetched successfully", data: response });
            }
        } catch (error: any) {
            res.status(400).json({
                message: `Something went wrong while getting the details:${error}`,
            });
        }
    }

    async acceptApplication(req: Request, res: Response): Promise<void> {
        try {
            const { doctorId } = req.params;
            const response = this.AdminService.approveApplication(doctorId as string);

            res
                .status(200)
                .json({ message: "Application approved successfully", response });
        } catch (error: any) {
            res.status(400).json(error);
        }
    }

    async getDoctorData(req: Request, res: Response): Promise<void> {
        try {
            const { doctorId } = req.query;
            console.log(req.query);
            console.log(doctorId);
            const response = await this.AdminService.getDoctorData(
                doctorId as string
            );
            res.status(200).json(response);
        } catch (error: any) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }

    async getDashboardData(req: Request, res: Response): Promise<void> {
        try {
            const response = await this.AdminService.getDashboardData();

            res
                .status(200)
                .json({ message: "Dashboard data retrieved successfully", response });
        } catch (error: any) {
            console.error("Error in getDashboardData controller:", error.message);

            if (
                error.message ===
                "Something went wrong while retrieving dashboard data."
            ) {
                res.status(400).json({ message: "Failed to retrieve dashboard data." });
            } else {
                res
                    .status(500)
                    .json({
                        message: "An unexpected error occurred",
                        error: error.message,
                    });
            }
        }
    }
}