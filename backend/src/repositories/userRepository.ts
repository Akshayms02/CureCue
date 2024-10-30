import { IUserRepository } from "../interfaces/IUserRepository";
import userModel, { IUser } from "../models/userModel";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel";
import specializationModel from "../models/specializationModel";
import mongoose from "mongoose";
import Slot from "../models/doctorSlotsModel";
import appointmentModel from "../models/appointmentModel";

export class UserRepository implements IUserRepository {
  async existUser(email: string): Promise<IUser | null> {
    return await userModel.findOne({ email });
  }

  async createUser(userData: IUser): Promise<IUser> {
    try {
      const newUser = new userModel(userData);
      return await newUser.save();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("Unknown error has occured");
      }
    }
  }

  async userLoginValidate(email: string, password: string): Promise<IUser> {
    try {
      const user = await userModel.findOne(
        { email },
        {
          _id: 0,
          userId: 1,
          name: 1,
          email: 1,
          phone: 1,
          password: 1,
          isBlocked: 1,
          DOB: 1,
          gender: 1,
        }
      );

      if (!user) {
        throw new Error("User doesnt Exist");
      }

      const PassCompare = await bcrypt.compare(password, user.password);
      if (!PassCompare) {
        throw new Error("Invalid Password");
      }

      if (user.isBlocked == true) {
        throw new Error("User is blocked");
      }

      return user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("Unknown Error from UserRepositary");
      }
    }
  }

  async getDoctors() {
    const doctors = await doctorModel
      .find(
        { kycStatus: "approved" },
        {
          doctorId: 1,
          name: 1,
          email: 1,
          image: 1,
          department: 1,
        }
      )
      .populate("department");

    return doctors;
  }
  async getSpecializations() {
    try {
      const specializations = await specializationModel.find({
        isListed: true,
      });

      if (specializations) {
        return specializations;
      }
    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async getDepDoctors(departmentId: string) {
    try {
      const doctors = await doctorModel
        .find(
          {
            department: new mongoose.Types.ObjectId(departmentId),
            kycStatus: "approved",
          },
          {
            doctorId: 1,
            name: 1,
            email: 1,
            image: 1,
            department: 1,
          }
        )
        .populate("department");

      return doctors;
    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async getDoctorData(doctorId: string) {
    try {
      const response = await doctorModel
        .findOne(
          { doctorId: doctorId },
          {
            doctorId: 1,
            name: 1,
            email: 1,
            image: 1,
            department: 1,
            fees: 1,
            phone: 1,
            gender: 1,
          }
        )
        .populate("department")
        .lean();

      if (response) {
        return response;
      }
    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async getSlots(doctorId: string, date: Date) {
    try {
      console.log(date);
      const response = await Slot.findOne({
        doctorId: doctorId,
        date: date,
      }).lean();
      if (response) {
        return response.timeSlots;
      } else {
        return [];
      }
    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
  async findAvailableSlot(
    doctorId: string,
    userId: string,
    start: string,
    date: Date,
    session: mongoose.ClientSession
  ) {
    date.setUTCHours(0, 0, 0, 0);
    const convertedDate = date.toISOString().replace("Z", "+00:00");
    const slot = await Slot.findOne({
      doctorId,
      date: convertedDate,
      "timeSlots.start": start,
      "timeSlots.isBooked": false,
      "timeSlots.isOnHold": true,
      "timeSlots.heldBy": userId,
    }).session(session); // Include session for transaction
    return slot;
  }
  async bookSlot(slot: any, userId: string, session: mongoose.ClientSession) {
    const timeSlot = slot.timeSlots.find(
      (ts: any) => ts.heldBy === userId && ts.isOnHold === true
    );
    if (!timeSlot) {
      throw new Error("The time slot is no longer available");
    }

    // Mark as booked
    timeSlot.isBooked = true;
    timeSlot.isOnHold = false;

    // Save the slot within the transaction
    await slot.save({ session });
  }
  async createAppointment(data: any, session: mongoose.ClientSession) {
    const {
      doctorId,
      userId,
      paymentId,
      fees,
      currency,
      start,
      end,
      patientName,
      date,
    } = data;
    console.log(data);
    const appointment = new appointmentModel({
      doctorId: doctorId,
      userId: userId,
      start: start,
      end: end,
      paymentId: paymentId,
      fees: fees,
      currency,
      paymentStatus: "payment completed",
      patientName: patientName,
      date: date,
    });

    await appointment.save({ session });
    return appointment;
  }

  async holdSlot(
    doctorId: string,
    date: Date,
    startTime: Date,
    userId: string,
    holdDurationMinutes: number = 5
  ) {
    date.setUTCHours(0, 0, 0, 0);
    const convertedDate = date.toISOString().replace("Z", "+00:00");
    const convertedDateString = startTime.toISOString().replace("Z", "+00:00");
    const holdExpiresAt = new Date();
    holdExpiresAt.setMinutes(holdExpiresAt.getMinutes() + holdDurationMinutes);
    console.log(convertedDate, convertedDateString);

    return await Slot.findOneAndUpdate(
      {
        doctorId,
        date: convertedDate,
        "timeSlots.start": convertedDateString,
        "timeSlots.isBooked": false,
        "timeSlots.isOnHold": false,
      },
      {
        $set: {
          "timeSlots.$.isOnHold": true,
          "timeSlots.$.heldBy": userId,
          "timeSlots.$.holdExpiresAt": holdExpiresAt,
        },
      },
      { new: true }
    ).lean();
  }
  async checkHold(doctorId: string, date: Date, startTime: Date) {
    date.setUTCHours(0, 0, 0, 0);
    const convertedDate = date.toISOString().replace("Z", "+00:00");
    const convertedDateString = startTime.toISOString().replace("Z", "+00:00");
    console.log(convertedDate, convertedDateString);
    return await Slot.find({
      doctorId,
      date: convertedDate,
      "timeSlots.start": convertedDateString,
    }).lean();
  }

  async updateProfile(updateData: {
    userId: string;
    name: string;
    DOB: string;
    gender: string;
    phone: string;
    email: string;
  }) {
    try {
      // Find the user by ID
      const user = await userModel.findOne({ userId: updateData.userId });
      if (!user) {
        throw new Error("User not found");
      }
      console.log(updateData);
      Object.assign(user, updateData);

      const updatedUser = await user.save();

      return updatedUser;
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }
}
