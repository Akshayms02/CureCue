import mongoose from "mongoose";
import { IUserRepository } from "../../interfaces/user/User.repository.interface";
import specializationModel from "../../models/specializationModel";
import doctorModel from "../../models/doctorModel";
import Slot from "../../models/doctorSlotsModel";
import userModel, { IUser } from "../../models/userModel";


export class UserRepository implements IUserRepository {
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
    async updatePassword(userId: string, hashedPassword: string): Promise<any> {
        return await userModel.findOneAndUpdate(
            { userId: userId },
            { password: hashedPassword }
        );
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


    async getUserById(userId: string): Promise<IUser | null> {
        return await userModel.findOne({ userId: userId });
    }

    async existUser(email: string): Promise<IUser | null> {
        return await userModel.findOne({ email });
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

}