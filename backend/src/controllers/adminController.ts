import { Request, Response } from "express";
import { adminServices } from "../services/adminServices";

export default class AdminController {
  private adminService: adminServices;

  constructor(adminServices: adminServices) {
    this.adminService = adminServices;
  }

  async loginAdmin(req: Request, res: Response): Promise<void> {
    try {
      console.log("login adminController");

      const { email, password } = req.body;

      const loginResponse = await this.adminService.verifyAdmin(
        email,
        password
      );
      console.log("controller res", loginResponse);

      const response = {
        accessToken: loginResponse.accessToken,
        adminInfo: loginResponse.adminInfo,
      };
      console.log(res);

      res.cookie("refreshToken", loginResponse.refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      console.log("logindata", response);
      res.status(200).json({ message: "Login successful", response });
    } catch (error: any) {
      console.log("controller error");
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
  async addSpecialization(req: Request, res: Response): Promise<void> {
    try {
      console.log("Entering addSpecialization method in adminController");

      // Extract name and description from request body
      const { name, description } = req.body;

      // Call the service to add a new specialization
      const response = await this.adminService.addSpecialization(
        name,
        description
      );

      // Log the response for debugging
      console.log("Specialization successfully created:", response);

      // Send success response
      res
        .status(200)
        .json({ message: "Specialization added successfully", response });
    } catch (error: any) {
      // Log the error for debugging
      console.error("Error in addSpecialization controller:", error.message);

      // Send appropriate error response based on the error message
      if (
        error.message ===
        "Something went wrong while creating the specialization."
      ) {
        res.status(400).json({
          message: "Something went wrong while creating the specialization.",
        });
      } else {
        // Handle any other unexpected errors
        res.status(500).json({
          message: "An unexpected error occurred",
          error: error.message,
        });
      }
    }
  }
  async getSpecialization(req: Request, res: Response): Promise<void> {
    try {
      console.log("Entering addSpecialization method in adminController");

      const response = await this.adminService.getSpecialization();

      console.log("Specialization successfully fetched", response);

      res
        .status(200)
        .json({ message: "Specialization added successfully", response });
    } catch (error: any) {
      console.error("Error in addSpecialization controller:", error.message);

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
      console.log("Entering editSpecialization method in adminController");
      const { id, name, description } = req.body;

      const response = await this.adminService.editSpecialization(
        id,
        name,
        description
      );

      console.log("Specialization successfully edited", response);

      res
        .status(200)
        .json({ message: "Specialization updated successfully", response });
    } catch (error: any) {
      console.error("Error in editSpecialization controller:", error.message);

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
      console.log("Entering editSpecialization method in adminController");
      const { id } = req.body;

      const response = await this.adminService.listUnlistSpecialization(id);

      console.log("Specialization successfully edited", response);

      res
        .status(200)
        .json({ message: "Specialization updated successfully", response });
    } catch (error: any) {
      console.error("Error in editSpecialization controller:", error.message);

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
  async getApplication(req: Request, res: Response): Promise<void> {
    try {
      console.log("Entering  method in adminController");

      const response = await this.adminService.getApplication();

      console.log("Specialization successfully fetched", response);

      res
        .status(200)
        .json({ message: "Specialization added successfully", response });
    } catch (error: any) {
      console.error("Error in addSpecialization controller:", error.message);

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
  async getDoctorApplication(req: Request, res: Response): Promise<void> {
    try {
      console.log("Entering  method in adminController");
      const applicationId = req.params.applicationId;
      console.log("a;sasasasasa", applicationId);

      const response = await this.adminService.getDoctorApplication(
        applicationId as string
      );

      console.log("successfully fetched", response);

      res
        .status(200)
        .json({ message: "Specialization added successfully", response });
    } catch (error: any) {
      console.error("Error in addSpecialization controller:", error.message);

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
  async approveApplication(req: Request, res: Response): Promise<void> {
    try {
      console.log("Entering approve method in adminController");
      const doctorId = req.params.doctorId;
      console.log("sasa", doctorId);

      const response = await this.adminService.approveApplication(
        doctorId as string
      );

      console.log("successfully fetched", response);

      res.status(200).json({ message: "Application approved successfully" });
    } catch (error: any) {
      console.error("Error in addSpecialization controller:", error.message);

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

  async rejectApplication(req: Request, res: Response): Promise<void> {
    try {
      console.log("Entering reject method in adminController");
      const doctorId = req.params.doctorId;
      const { reason } = req.body; // Extract the reason from the request body
      console.log("Doctor ID:", doctorId);
      console.log("Rejection Reason:", reason);
      console.log("Rhgff:", req.body);

      // Pass the doctorId and reason to the service layer
      const response = await this.adminService.rejectApplication(
        doctorId as string,
        reason
      );

      console.log("Successfully processed rejection:", response);
      res.status(200).json({ message: "Application rejected successfully" });
    } catch (error: any) {
      console.error("Error in rejectApplication controller:", error.message);

      if (
        error.message ===
        "Something went wrong while rejecting the application."
      ) {
        res.status(400).json({
          message: "Something went wrong while rejecting the application.",
        });
      } else {
        res.status(500).json({
          message: "An unexpected error occurred",
          error: error.message,
        });
      }
    }
  }
}
