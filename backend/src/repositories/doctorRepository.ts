import { IDoctorRepository } from "../interfaces/IDoctorRepository";
import doctorModel, { IDoctor } from "../models/doctorModel";
import doctorApplicationModel from "../models/doctorApplicationModel";
import bcrypt from "bcrypt";
import { DoctorData } from "../interfaces/doctorInterfaces";
import { docDetails } from "../controllers/doctorController";
import Slot from "../models/doctorSlotsModel";
import appointmentModel from "../models/appointmentModel";
import walletModel, { ITransaction } from "../models/walletModel";
import mongoose from "mongoose";
import NotificationModel from "../models/notificationModel";

export class DoctorRepository implements IDoctorRepository {
  async existUser(email: string): Promise<IDoctor | null> {
    return await doctorModel.findOne({ email });
  }

  async createUser(userData: IDoctor): Promise<IDoctor> {
    try {
      const newUser = new doctorModel(userData);
      return await newUser.save();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error creating a new user: ${error.message}`);
      } else {
        throw new Error("Unknown error has occured");
      }
    }
  }

  async userLoginValidate(email: string, password: string): Promise<IDoctor> {
    try {
      const user = await doctorModel
        .findOne(
          { email },
          {
            _id: 0,
            doctorId: 1,
            name: 1,
            email: 1,
            phone: 1,
            password: 1,
            isBlocked: 1,
            kycStatus: 1,
            DOB: 1,
            department: 1,
            fees: 1,
            gender: 1,
            image: 1,
          }
        )
        .populate("department");

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
        throw new Error("Unknown Error from DoctorRepositary");
      }
    }
  }

  async uploadDoctorData(
    data: DoctorData,
    docDetails: docDetails
  ): Promise<any> {
    try {
      const doctorData = await doctorModel.findOneAndUpdate(
        { email: data.email },
        { kycStatus: "submitted" },
        {
          new: true,
        }
      );
      if (doctorData) {
        const details = {
          doctorId: doctorData._id,
          name: data.name,
          DOB: data.dob,
          department: data.department,
          gender: data.gender,
          image: docDetails.profileUrl,
          fees: data.fees,
          kycDetails: {
            certificateImage: docDetails.certificateUrl,
            qualificationImage: docDetails.qualificationUrl,
            adharFrontImage: docDetails.aadhaarFrontImageUrl,
            adharBackImage: docDetails.aadhaarBackImageUrl,
            adharNumber: data.aadhaarNumber,
          },
        };

        await doctorApplicationModel.create(details);

        return doctorData;
      } else {
        return false;
      }
    } catch (error: any) {
      throw new Error(`Something went wrong : ${error}`);
    }
  }

  async createSlot(
    parsedDate: any,
    formattedTimeSlots: any,
    doctorId: string
  ): Promise<any> {
    try {
      const existingSlot = await Slot.findOne({
        doctorId: doctorId,
        date: parsedDate,
      });
      if (existingSlot) {
        const overlappingSlots = formattedTimeSlots.filter((newSlot: any) => {
          return existingSlot.timeSlots.some((existingTimeSlot: any) => {
            const newStart = new Date(newSlot.start).getTime();
            const newEnd = new Date(newSlot.end).getTime();
            const existingStart = new Date(existingTimeSlot.start).getTime();
            const existingEnd = new Date(existingTimeSlot.end).getTime();

            // Check if there is any overlap
            return (
              (newStart >= existingStart && newStart < existingEnd) || // New slot starts within an existing slot
              (newEnd > existingStart && newEnd <= existingEnd) || // New slot ends within an existing slot
              (newStart <= existingStart && newEnd >= existingEnd) // New slot fully overlaps an existing slot
            );
          });
        });

        if (overlappingSlots.length > 0) {
          // If there are overlapping slots, return an error
          return {
            status: false,
            message: "Some of the time slots overlap with existing slots",
            overlappingSlots,
          };
        }

        // No overlapping slots, add the new slots to the existing slot document
        existingSlot.timeSlots.push(...formattedTimeSlots);
        const response = await existingSlot.save(); // Save the updated slot document

        if (response) {
          return {
            status: true,
            message: "Added to the existing slot",
          };
        }
      } else {
        // If the slot doesn't exist, create a new Slot document
        const newSlot = new Slot({
          doctorId: doctorId,
          date: parsedDate,
          timeSlots: formattedTimeSlots,
        });

        const response = await newSlot.save();
        if (response) {
          return { status: true, message: "Added slot as new" };
        }
      }
    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async checkSlots(doctorId: string, date: string) {
    try {
      const slot = await Slot.findOne({
        doctorId: doctorId as string,
        date: new Date(date as string),
      });
      if (!slot) {
        throw new Error("No slots on this date Exists");
      }

      const availableSlots = slot?.timeSlots?.map((element) => element);
      console.log("slot:", availableSlots);

      return availableSlots;
    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async deleteSlot(start: string, doctorId: string, date: string) {
    try {
      const slot = await Slot.findOne({ doctorId, date: new Date(date) });
      if (!slot) {
        throw new Error("Slot not found");
      }
      const updatedTimeSlots = slot.timeSlots.filter(
        (timeSlot) =>
          timeSlot.start.toISOString() !== new Date(start).toISOString()
      );

      if (updatedTimeSlots.length === slot.timeSlots.length) {
        throw new Error("Time Slot Not Found");
      }

      slot.timeSlots = updatedTimeSlots;

      await slot.save();

      return { status: true };
    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async checkAvialability(
    doctorId: string,
    parsedDate: Date,
    parsedStart: Date,
    parsedEnd: Date
  ) {
    const slot = await Slot.findOne({
      doctorId,
      date: parsedDate,
    });

    if (!slot) {
      return { available: true };
    }

    const isAvailable = !slot.timeSlots.some((s) => {
      const startTime = new Date(s.start);
      const endTime = new Date(s.end);
      return parsedStart < endTime && parsedEnd > startTime; // Check for overlap
    });

    return { available: isAvailable };
  }

  async getDoctorData(doctorId: string) {
    try {
      console.log(doctorId);
      const user = await doctorModel
        .findOne(
          { doctorId },
          {
            _id: 0,
            doctorId: 1,
            name: 1,
            email: 1,
            phone: 1,
            password: 1,
            isBlocked: 1,
            kycStatus: 1,
            DOB: 1,
            department: 1,
            fees: 1,
            gender: 1,
            image: 1,
          }
        )
        .populate("department")
        .lean();

      return user;
    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
  async findAppointmentsByDoctor(doctorId: string) {
    try {
      const appointments = await appointmentModel.find({ doctorId });
      return appointments;
    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
  async updateProfile(updateData: {
    doctorId: string;
    fees: number;
    gender: string;
    phone: string;
  }) {
    try {
      // Find the doctor by ID
      console.log(updateData);
      const doctor = await doctorModel.findOne({
        doctorId: updateData.doctorId,
      });
      if (!doctor) {
        throw new Error("doctor not found");
      }

      Object.assign(doctor, updateData);

      const updatedDoctor = await doctor.save();

      return updatedDoctor;
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }

  async getAllStatistics(doctorId: string) {
    try {
      // Get wallet details
      const wallet = await walletModel.findOne({ doctorId });

      // Calculate total revenue from transactions
      const totalRevenue = wallet
        ? wallet.transactions.reduce((acc, transaction) => {
            return transaction.transactionType === "credit"
              ? acc + transaction.amount
              : acc; // Ignore debit amounts
          }, 0)
        : 0;

      // Get current date and calculate the start of 12 months ago
      const currentDate = new Date();
      const startOfLastYear = new Date(currentDate);
      startOfLastYear.setMonth(currentDate.getMonth() - 11); // 11 months back from current month

      // Create an array of months for the last 12 months
      const months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(startOfLastYear);
        date.setMonth(startOfLastYear.getMonth() + i);
        return {
          month: date,
          monthStr: `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}`,
        };
      });

      // Get monthly revenue from transactions for the past 12 months
      const monthlyRevenue = await walletModel.aggregate([
        { $match: { doctorId } },
        { $unwind: "$transactions" },
        {
          $match: {
            "transactions.date": {
              $gte: startOfLastYear, // Filter for the last 12 months
              $lte: currentDate,
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m", date: "$transactions.date" },
            },
            total: {
              $sum: {
                $cond: [
                  { $eq: ["$transactions.transactionType", "credit"] },
                  "$transactions.amount",
                  0,
                ],
              },
            },
          },
        },
        { $sort: { _id: 1 } }, // Sort by month
      ]);

      // Create a map of the monthly revenue results for easy access
      const revenueMap = monthlyRevenue.reduce((acc, item) => {
        acc[item._id] = item.total;
        return acc;
      }, {});

      const monthlyRevenueArray = months.map((month) => ({
        month: month.monthStr,
        totalRevenue: revenueMap[month.monthStr] || 0,
      }));

      // Get total appointments and today's appointments
      const totalAppointments = await appointmentModel.countDocuments({
        doctorId: doctorId,
      });
      const today = new Date();
      const startOfToday = new Date(today.setHours(0, 0, 0, 0));
      const endOfToday = new Date(today.setHours(23, 59, 59, 999));
      const todaysAppointments = await appointmentModel.countDocuments({
        doctorId: doctorId,
        date: { $gte: startOfToday, $lte: endOfToday },
      });

      const uniquePatients = await appointmentModel.distinct("userId", {
        doctorId: doctorId,
      });

      return {
        totalRevenue,
        monthlyRevenue: monthlyRevenueArray,
        totalAppointments,
        todaysAppointments,
        numberOfPatients: uniquePatients.length,
      };
    } catch (error: any) {
      console.error("Error fetching statistics:", error.message);
      throw new Error(error.message);
    }
  }
  async completeAppointment(
    appointmentId: string,
    prescription: string
  ): Promise<any> {
    try {
      const appointment = await appointmentModel.findOneAndUpdate(
        { _id: appointmentId },
        { status: "completed", prescription: prescription },
        { new: true }
      );

      if (!appointment) {
        throw new Error("Appointment not found");
      }

      let wallet = await walletModel.findOne({
        doctorId: appointment.doctorId,
      });

      const transactionId =
        "txn_" + Date.now() + Math.floor(Math.random() * 10000);
      const transactionAmount = 0.9 * appointment.fees;

      const transaction: ITransaction = {
        amount: transactionAmount,
        transactionId: transactionId,
        transactionType: "credit",
        appointmentId: appointmentId,
      };

      if (wallet) {
        wallet.transactions.push(transaction);
        wallet.balance += transactionAmount;
        await wallet.save();
      } else {
        wallet = new walletModel({
          doctorId: appointment.doctorId,
          balance: transactionAmount,
          transactions: [transaction],
        });
        await wallet.save();
      }

      return appointment;
    } catch (error: any) {
      console.error("Error completing appointment:", error.message);
      throw new Error(error.message);
    }
  }

  async getWalletDetails(
    doctorId: string,
    status: string,
    page: number,
    limit: number
  ) {
    try {
      console.log(status, page, limit);

      const skip = (page - 1) * limit;
      const query: any = { doctorId };

      if (status !== "All") {
        query["transactions.transactionType"] = status;
      }

      const wallet = await walletModel.findOne(query).lean();

      if (!wallet) {
        return { transactions: [], totalPages: 0, totalCount: 0, balance: 0 };
      }

      let filteredTransactions = wallet.transactions;
      if (status !== "All") {
        filteredTransactions = wallet.transactions.filter(
          (transaction: any) => transaction.transactionType === status
        );
      }

      const totalCount = filteredTransactions.length;

      const paginatedTransactions = filteredTransactions.slice(
        skip,
        skip + limit
      );

      const totalPages = Math.ceil(totalCount / limit);

      return {
        transactions: paginatedTransactions,
        totalCount,
        totalPages,
        currentPage: page,
        balance: wallet.balance,
      };
    } catch (error: any) {
      console.error("Error getting wallet details:", error.message);
      throw new Error(`Failed to get wallet details: ${error.message}`);
    }
  }

  async withdrawMoney(doctorId: string, withdrawalAmount: number) {
    try {
      const wallet = await walletModel.findOne({ doctorId });

      if (!wallet) {
        throw new Error("Wallet not found for the specified doctor.");
      }

      if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
        throw new Error("A valid withdrawal amount is required.");
      }
      if (wallet.balance < withdrawalAmount) {
        throw new Error("Insufficient balance for withdrawal.");
      }

      wallet.balance -= withdrawalAmount;

      const transactionId =
        "txn_" + Date.now() + Math.floor(Math.random() * 10000);
      const transaction: ITransaction = {
        amount: withdrawalAmount,
        transactionId: transactionId,
        transactionType: "debit",
      };

      wallet.transactions.push(transaction);

      await wallet.save();

      return wallet;
    } catch (error: any) {
      console.error("Error processing withdrawal:", error.message);
      throw new Error(error.message);
    }
  }

  async getMedicalRecords(userId: string): Promise<any> {
    try {
      const medicalRecords = await appointmentModel.find({
        userId: userId,
        prescription: { $ne: null },
      });

      return medicalRecords;
    } catch (error: any) {
      console.error("Error getting medical records:", error.message);
      throw new Error(
        `Failed to fetch medical records for user ${userId}: ${error.message}`
      );
    }
  }

  async cancelAppointment(appointmentId: string, reason: string): Promise<any> {
    try {
      const appointment = await appointmentModel.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(appointmentId) },
        {
          status: "cancelled by Doctor",
          reason: reason,
          paymentStatus: "refunded",
        },
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
              new Date(appointment.start).getTime()
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
          content: "Application was cancelled by the doctor",
          type: "appointment cancellation",
          read: false,
          appointmentId: appointmentId,
        };
        const doctorNotificationContent = {
          content: "Application cancellation successful",
          type: "appointment cancellation",
          read: false,
          appointmentId: appointmentId,
        };

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
      }
    } catch (error: any) {
      console.error("Error processing cancellation:", error.message);
      throw new Error(error.message);
    }
  }
}
