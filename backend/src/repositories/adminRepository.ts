import adminModel from "../models/adminModel";
import specializationModel from "../models/specializationModel";
import doctorModel from "../models/doctorModel";
import { IAdminRepository } from "../interfaces/IAdminRepository";
import userModel from "../models/userModel";
import doctorApplicationModel from "../models/doctorApplicationModel";

export class AdminRepository implements IAdminRepository {
  async adminCheck(email: string) {
    try {
      const adminData = await adminModel.findOne({ email: email });

      if (adminData) {
        return adminData;
      }
      throw new Error("Doctor Doesn't exist");
    } catch (error: any) {
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
      throw new Error(error.message);
    }
  }
  async getAllSpecialization() {
    try {
      const specializations = await specializationModel.find();

      return specializations;
    } catch (error: any) {
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

      return updatedSpecialization;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getAllUsers() {
    try {
      const users = await userModel.find();

      return users;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getAllDoctors() {
    try {
      const doctors = await doctorModel.find({ kycStatus: "approved" });

      return doctors;
    } catch (error: any) {
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

      return updatedUser;
    } catch (error: any) {
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

      return updatedDoctor;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getAllApplications() {
    try {
      const response = await doctorApplicationModel
        .find()
        .populate("department");

      return response;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getSingleDoctorApplication(id: string) {
    try {
      const response = doctorApplicationModel
        .findById(id)
        .populate("department");
      return response;
    } catch (error: any) {
      throw new Error(
        `Something went wrong while fetching the details:${error}`
      );
    }
  }

  async approveDoctor(doctorId: string) {
    try {
      const response = await doctorApplicationModel.findOne({
        doctorId: doctorId,
      });
      if (!response) {
        throw new Error("Doctor application not found");
      }

      const updatedDoctor = await doctorModel.findByIdAndUpdate(
        doctorId,
        {
          name: response.name,
          DOB: response.DOB,
          department: response.department,
          gender: response.gender,
          image: response.image,
          fees: response.fees,
          kycDetails: response.kycDetails,
          kycStatus: "approved",
        },
        { new: true }
      );

      if (!updatedDoctor) {
        throw new Error("Doctor not found");
      }

      return { status: true };
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
