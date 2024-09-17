import adminModel from "../models/adminModel";
import specializationModel from "../models/specializationModel";
import doctorModel from "../models/doctorModel";
import { IAdminRepository } from "../interfaces/IAdminRepository";
import userModel from "../models/userModel";

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

  async getAllUsers() {
    try {
      const users = await userModel.find();
      console.log("users", users);

      return users;
    } catch (error: any) {
      console.error("Error getting users:", error.message);
      throw new Error(error.message);
    }
  }
  async getAllDoctors() {
    try {
      const doctors = await doctorModel.find({ kycStatus: "approved" });
      console.log("doctors", doctors);

      return doctors;
    } catch (error: any) {
      console.error("Error getting doctors:", error.message);
      throw new Error(error.message);
    }
  }

  async changeUserStatus(id: string) {
    try {
      const user = await userModel.findOne({ _id: id });
      if (!user) {
        throw new Error("user not found");
      }

      user.isBlocked = !user.isBlocked;

      const updatedUser = await user.save();
      console.log("Updated user:", updatedUser);

      return updatedUser;
    } catch (error: any) {
      console.error("Error updating user:", error.message);
      throw new Error(error.message);
    }
  }
  async changeDoctorStatus(id: string) {
    try {
      const doctor = await doctorModel.findOne({ _id: id });
      if (!doctor) {
        throw new Error("doctor not found");
      }

      doctor.isBlocked = !doctor.isBlocked;

      const updatedDoctor = await doctor.save();
      console.log("Updated doctor:", updatedDoctor);

      return updatedDoctor;
    } catch (error: any) {
      console.error("Error updating doctor:", error.message);
      throw new Error(error.message);
    }
  }
}
