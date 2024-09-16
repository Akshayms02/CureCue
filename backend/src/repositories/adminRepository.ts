import mongoose from "mongoose";
import adminModel from "../models/adminModel";
import specializationModel from "../models/specializationModel";
import doctorApplicationModel from "../models/doctorApplicationModel";
import doctorModel from "../models/doctorModel";
import rejectDoctorModel from "../models/rejectedDoctorModel";
import { IAdminRepository } from "../interfaces/IAdminRepository";

export class AdminRepository implements IAdminRepository {
  async adminCheck(email: string) {
    try {
      console.log("login adminrep");
      const adminData = await adminModel.findOne({ email: email });
      console.log(adminData);
      if (adminData) {
        return adminData;
      }
      throw new Error("Doctor Doesn't exist");
    } catch (error: any) {
      console.log("rep error");
      throw new Error(error.message);
    }
  }
  async createSpecialization(name: string, description: string) {
    try {
      // Create a new specialization document
      const newSpecialization = new specializationModel({
        name,
        description,
      });

      const savedSpecialization = await newSpecialization.save();

      return savedSpecialization;
    } catch (error: any) {
      console.error("Error creating specialization:", error.message);
      throw new Error(error.message);
    }
  }
  async getAllSpecialization() {
    try {
      const specializations = await specializationModel.find();

      return specializations;
    } catch (error: any) {
      console.error("Error getting specialization:", error.message);
      throw new Error(error.message);
    }
  }
  async updateSpecialization(id: number, name: string, description: string) {
    try {
      const specializations = await specializationModel.updateOne(
        { _id: id },
        { name: name, description: description }
      );

      return specializations;
    } catch (error: any) {
      console.error("Error updating specialization:", error.message);
      throw new Error(error.message);
    }
  }
  async changeSpecializationStatus(id: number) {
    try {
      const specialization = await specializationModel.findOne({ _id: id });
      if (!specialization) {
        throw new Error("Specialization not found");
      }

      specialization.isListed = !specialization.isListed;

      const updatedSpecialization = await specialization.save();
      console.log("Updated Specialization:", updatedSpecialization);

      return updatedSpecialization;
    } catch (error: any) {
      console.error("Error updating specialization:", error.message);
      throw new Error(error.message);
    }
  }
  async getAllApplication() {
    try {
      const applications = await doctorApplicationModel.find();

      return applications;
    } catch (error: any) {
      console.error("Error getting specialization:", error.message);
      throw new Error(error.message);
    }
  }
  async getApplication(doctorId: string) {
    try {
      const application = await doctorApplicationModel.findById(doctorId);

      console.log("pppp", application);

      return application;
    } catch (error: any) {
      console.error("Error getting specialization:", error.message);
      throw new Error(error.message);
    }
  }
  async approveDoctorApplication(doctorId: string) {
    try {
      // Fetch the doctor application by doctorId
      const application = await doctorApplicationModel.findOne({
        doctorId: doctorId,
      });
      if (!application) {
        throw new Error("Doctor application not found");
      }

      console.log("Doctor application:", application);

      // Update the doctor model with the details from the application, including setting KYC status to "approved"
      const updatedDoctor = await doctorModel.findByIdAndUpdate(
        doctorId,
        {
          name: application.name,
          DOB: application.DOB,
          department: application.department,
          gender: application.gender,
          image: application.image,
          fees: application.fees,
          kycDetails: application.kycDetails,
          kycStatus: "approved", // Set the KYC status to "approved"
        },
        { new: true } // This option returns the updated document
      );

      if (!updatedDoctor) {
        throw new Error("Doctor not found");
      }

      console.log("Updated doctor details:", updatedDoctor);

      // Delete the approved doctor application
      await doctorApplicationModel.deleteOne({ doctorId: doctorId });
      console.log("Doctor application deleted");

      return { status: true };
    } catch (error: any) {
      console.error("Error approving doctor application:", error.message);
      throw new Error(error.message);
    }
  }
  async rejectDoctorApplication(doctorId: string, reason: string) {
    try {
      const rejectedEntry = new rejectDoctorModel({
        doctorId: new mongoose.Types.ObjectId(doctorId),
        reason,
      });

      await rejectedEntry.save();
      await doctorModel.findByIdAndUpdate(doctorId, {
        kycStatus: "rejected",
      });

      await doctorApplicationModel.deleteOne({ doctorId: doctorId });

      return { success: true };
    } catch (error: any) {
      console.error("Error rejecting doctor application:", error.message);
      throw new Error(
        "An error occurred while rejecting the doctor application."
      );
    }
  }
}
