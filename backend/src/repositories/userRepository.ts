import { IUserRepository } from "../interfaces/IUserRepository";
import userModel, { IUser } from "../models/userModel";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel";
import specializationModel from "../models/specializationModel";
import mongoose from "mongoose";
import Slot from "../models/doctorSlotsModel";
import appointmentModel from "../models/appointmentModel";
import NotificationModel from "../models/notificationModel";
import { sendAppointmentCancellationNotification } from "../config/socketConfig";

export class UserRepository implements IUserRepository {
  async existUser(email: string): Promise<IUser | null> {
    return await userModel.findOne({ email });
  }

  async getUserById(userId: string): Promise<IUser | null> {
    return await userModel.findOne({ userId: userId });
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<any> {
    return await userModel.findOneAndUpdate(
      { userId: userId },
      { password: hashedPassword }
    );
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
  async getSpecializations(skip: number, limit: number) {
    try {
      const specializations = await specializationModel
        .find({ isListed: true })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await specializationModel.countDocuments({
        isListed: true,
      });

      return { specializations, total };
    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Error fetching specializations from repository");
    }
  }

  async getDepDoctors(departmentId: string): Promise<any> {
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

  async getDoctorData(doctorId: string): Promise<any> {
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

  async getSlots(doctorId: string, date: Date): Promise<any> {
    try {
      console.log(date);
      const response = await Slot.findOne({
        doctorId: doctorId,
        date: date,
        "timeSlots.end": { $gte: new Date() },
      }).lean();
      if (response) {
        console.log(response);
        return response.timeSlots.filter(
          (slot) => new Date(slot.end) >= new Date()
        );
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
  ): Promise<any> {
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
  async bookSlot(
    slot: any,
    userId: string,
    session: mongoose.ClientSession
  ): Promise<any> {
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
  ): Promise<any> {
    console.log(date, startTime);
    date.setUTCHours(0, 0, 0, 0);
    const convertedDate = date.toISOString().replace("Z", "+00:00");
    const convertedDateString = startTime.toISOString().replace("Z", "+00:00");
    const holdExpiresAt = new Date();
    holdExpiresAt.setMinutes(holdExpiresAt.getMinutes() + holdDurationMinutes);
    console.log(convertedDate, convertedDateString);
    console.log(
      doctorId,
      " ",
      convertedDate,
      " ",
      userId,
      " ",
      convertedDateString
    );
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
  async checkHold(doctorId: string, date: Date, startTime: Date): Promise<any> {
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

  async getAllAppointments(
    userId: string,
    status: string,
    page: number,
    limit: number
  ) {
    try {
      const query: any = { userId: userId };
      console.log(status);
      if (status[0] !== "All") {
        query.status = status[0];
      }

      const skip = (page - 1) * limit;

      const appointments = await appointmentModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean();

      const totalAppointments = await appointmentModel.countDocuments(query);

      const totalPages = Math.ceil(totalAppointments / limit);

      const populatedAppointments = await Promise.all(
        appointments.map(async (appointment) => {
          const doctor = await doctorModel
            .findOne({ doctorId: appointment.doctorId }, { password: 0 })
            .lean();
          return { ...appointment, doctor };
        })
      );

      return { appointments: populatedAppointments, totalPages };
    } catch (error: any) {
      console.error("Error getting appointments:", error.message);
      throw new Error(error.message);
    }
  }

  async getAppointment(appointmentId: string): Promise<any> {
    try {
      const appointment = await appointmentModel.findById(appointmentId).lean();

      if (!appointment) {
        throw new Error(`Appointment with ID ${appointmentId} not found`);
      }

      const doctor = await doctorModel
        .findOne({ doctorId: appointment.doctorId }, { password: 0 })
        .lean();

      return { ...appointment, doctor };
    } catch (error: any) {
      console.error("Error getting appointment:", error.message);
      throw new Error(error.message);
    }
  }
  async addReview(
    appointmentId: string,
    rating: number,
    reviewText: string
  ): Promise<any> {
    try {
      const updatedAppointment = await appointmentModel.findOneAndUpdate(
        { _id: appointmentId },
        {
          $set: {
            "review.rating": rating,
            "review.description": reviewText,
          },
        },
        { new: true }
      );

      if (!updatedAppointment) {
        throw new Error("Appointment not found");
      }

      return updatedAppointment;
    } catch (error: any) {
      console.error("Error adding review:", error.message);
      throw new Error(error.message);
    }
  }

  async getDoctorReview(doctorId: string) {
    try {
      const isReviewDataPresent = true;

      const doctor = await doctorModel.aggregate([
        {
          $match: { doctorId: doctorId }, // Match the doctor by doctorId
        },
        {
          $lookup: {
            from: "appointments",
            let: { doctorId: "$doctorId" }, // Pass the doctorId to the next stage
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$doctorId", "$$doctorId"], // Match doctorId in both collections
                  },
                },
              },
              {
                $project: {
                  patientName: 1,
                  review: 1,
                  prescription: 1,
                  date: 1,
                  start: 1,
                  end: 1,
                  status: 1,
                }, // Only include necessary fields
              },
            ],
            as: "appointments",
          },
        },
        {
          $project: {
            name: 1,
            _id: 1,
            doctorId: 1,
            email: 1,
            department: 1,
            fees: 1,
            image: 1,
            appointments: {
              $cond: [
                { $eq: [isReviewDataPresent, true] }, // Check if review filtering is needed
                {
                  $map: {
                    input: {
                      $filter: {
                        input: "$appointments", // Filter appointments based on review.rating
                        as: "appointment",
                        cond: {
                          $gt: [
                            { $ifNull: ["$$appointment.review.rating", 0] }, // Default rating to 0 if null
                            0,
                          ],
                        },
                      },
                    },
                    as: "appointment",
                    in: {
                      review: "$$appointment.review",
                      patientName: "$$appointment.patientName",
                    },
                  },
                },
                [], // If no review data is present, return an empty array
              ],
            },
          },
        },
      ]);

      if (doctor.length === 0) {
        return null;
      }

      return doctor[0];
    } catch (error: any) {
      console.error("Error getting doctor:", error.message);
      throw new Error(`Failed to fetch doctor ${doctorId}: ${error.message}`);
    }
  }

  async cancelAppointment(appointmentId: string): Promise<any> {
    try {
      console.log(appointmentId);
      const appointment = await appointmentModel.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(appointmentId) },
        { status: "cancelled", paymentStatus: "refunded" },
        { new: true }
      );

      if (!appointment) {
        throw new Error(`Appointment with ID ${appointmentId} not found`);
      }

      if (appointment) {
        const slotUpdation = await Slot.findOne({
          doctorId: appointment.doctorId,
          date: appointment.date,
        });

        if (slotUpdation) {
          const matchingSlot = slotUpdation.timeSlots.find(
            (slot: any) =>
              new Date(slot.start).getTime() ===
              new Date(appointment.start as Date).getTime()
          );

          if (matchingSlot) {
            matchingSlot.isBooked = false;
            matchingSlot.isOnHold = false;
            matchingSlot.heldBy = undefined;
            matchingSlot.holdExpiresAt = undefined;

            await slotUpdation.save();
          }
        }

        const userNotificationContent = {
          content: "Your Appointment cancelled successfully",
          type: "appointment cancellation", // Assume "message" type for chat notifications; adjust as needed
          read: false,
          appointmentId: appointmentId,
        };
        const doctorNotificationContent = {
          content: "Appointment has been cancelled by patient",
          type: "appointment cancellation", // Assume "message" type for chat notifications; adjust as needed
          read: false,
          appointmentId: appointmentId,
        };

        // Find the receiver's notification document, or create a new one if it doesn't exist
        await NotificationModel.findOneAndUpdate(
          { receiverId: appointment.userId },
          { $push: { notifications: userNotificationContent } },
          { new: true, upsert: true }
        );
        await NotificationModel.findOneAndUpdate(
          { receiverId: appointment.doctorId },
          { $push: { notifications: doctorNotificationContent } },
          { new: true, upsert: true }
        );

        sendAppointmentCancellationNotification(
          appointment.doctorId,
          appointment.userId
        );
      }

      return appointment;
    } catch (error: any) {
      console.error("Error canceling appointment:", error.message);
      throw new Error(error.message);
    }
  }
}
