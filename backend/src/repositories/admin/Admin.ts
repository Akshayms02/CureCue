import mongoose from "mongoose";
import { IAdminRepository } from "../../interfaces/admin/Admin.repository.interface";
import doctorApplicationModel from "../../models/doctorApplicationModel";
import doctorModel from "../../models/doctorModel";
import specializationModel from "../../models/specializationModel";
import userModel from "../../models/userModel";
import walletModel from "../../models/walletModel";
import appointmentModel from "../../models/appointmentModel";


export class AdminRepository implements IAdminRepository {
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
    async getAllUsers(page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;
            const users = await userModel.find()
                .skip(skip)
                .limit(limit);

            const totalUsers = await userModel.countDocuments();

            return {
                users,
                totalUsers,
                totalPages: Math.ceil(totalUsers / limit),
                currentPage: page,
            };
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
            const createWallet = new walletModel({
                doctorId: doctorId,
                balance: 0,
                history: [],
            });

            await createWallet.save();

            return { status: true };
        } catch (error: any) {
            throw new Error(error);
        }
    }
    async getDoctorData(doctorId: string): Promise<any> {
        try {
            
            const response = await doctorModel
                .findOne(
                    { _id: new mongoose.Types.ObjectId(doctorId) },
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
            return response;
        } catch (error: any) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }
    async getAllStatistics() {
        try {
            const totalDoctors = await doctorModel.countDocuments();
            const totalUsers = await userModel.countDocuments();
            const activeUsers = await userModel.countDocuments({ isBlocked: false });
            const activeDoctors = await doctorModel.countDocuments({
                isBlocked: false,
            });

            const revenueData = await appointmentModel.aggregate([
                { $match: { status: "completed" } },
                {
                    $group: {
                        _id: null,
                        totalFees: { $sum: "$fees" },
                        doctorRevenue: { $sum: { $multiply: ["$fees", 0.9] } },
                        adminRevenue: { $sum: { $multiply: ["$fees", 0.1] } },
                    },
                },
            ]);

            const totalFees = revenueData.length > 0 ? revenueData[0].totalFees : 0;
            const doctorRevenue =
                revenueData.length > 0 ? revenueData[0].doctorRevenue : 0;
            const adminRevenue =
                revenueData.length > 0 ? revenueData[0].adminRevenue : 0;

            // Get current date and calculate the start date (12 months ago)
            const currentDate = new Date();
            const startDate = new Date();
            startDate.setMonth(currentDate.getMonth() - 12); // 12 months ago

            const usersAndDoctorsRegistrationData = await Promise.all([
                userModel.aggregate([
                    { $match: { createdAt: { $gte: startDate } } }, // Filter by createdAt date
                    {
                        $group: {
                            _id: {
                                year: { $year: "$createdAt" }, // Separate year and month
                                month: { $month: "$createdAt" }, // Separate month
                            },
                            count: { $sum: 1 },
                        },
                    },
                    { $sort: { "_id.year": 1, "_id.month": 1 } },
                ]),
                doctorModel.aggregate([
                    { $match: { createdAt: { $gte: startDate } } }, // Filter by createdAt date
                    {
                        $group: {
                            _id: {
                                year: { $year: "$createdAt" }, // Separate year and month
                                month: { $month: "$createdAt" }, // Separate month
                            },
                            count: { $sum: 1 },
                        },
                    },
                    { $sort: { "_id.year": 1, "_id.month": 1 } },
                ]),
            ]);

            const monthlyStatistics: any = {};

            // Initialize each month with zero values for the last 12 months
            for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
                const monthDate = new Date();
                monthDate.setMonth(currentDate.getMonth() - monthOffset);
                const year = monthDate.getFullYear();
                const month = monthDate.getMonth() + 1; // Months are 0-indexed
                const key = `${year}-${month < 10 ? "0" : ""}${month}`; // Format as YYYY-MM

                monthlyStatistics[key] = {
                    users: 0,
                    doctors: 0,
                    revenue: 0,
                    totalFees: 0,
                    doctorRevenue: 0,
                    adminRevenue: 0,
                };
            }

            // Fill in registration data for users
            usersAndDoctorsRegistrationData[0].forEach((userData) => {
                const key = `${userData._id.year}-${userData._id.month < 10 ? "0" : ""
                    }${userData._id.month}`;
                if (monthlyStatistics[key]) {
                    monthlyStatistics[key].users = userData.count;
                }
            });

            // Fill in registration data for doctors
            usersAndDoctorsRegistrationData[1].forEach((doctorData) => {
                const key = `${doctorData._id.year}-${doctorData._id.month < 10 ? "0" : ""
                    }${doctorData._id.month}`;
                if (monthlyStatistics[key]) {
                    monthlyStatistics[key].doctors = doctorData.count;
                }
            });

            const revenueByMonth = await appointmentModel.aggregate([
                { $match: { status: "completed", date: { $gte: startDate } } }, // Filter by date
                {
                    $group: {
                        _id: {
                            year: { $year: "$date" }, // Separate year and month
                            month: { $month: "$date" }, // Separate month
                        },
                        totalFees: { $sum: "$fees" },
                        doctorRevenue: { $sum: { $multiply: ["$fees", 0.9] } },
                        adminRevenue: { $sum: { $multiply: ["$fees", 0.1] } },
                    },
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } },
            ]);

            // Update monthly statistics with revenue data
            revenueByMonth.forEach((revenueData: any) => {
                const key = `${revenueData._id.year}-${revenueData._id.month < 10 ? "0" : ""
                    }${revenueData._id.month}`;
                if (monthlyStatistics[key]) {
                    monthlyStatistics[key].revenue = revenueData.totalFees;
                    monthlyStatistics[key].totalFees = revenueData.totalFees;
                    monthlyStatistics[key].doctorRevenue = revenueData.doctorRevenue;
                    monthlyStatistics[key].adminRevenue = revenueData.adminRevenue;
                }
            });

            const userDoctorChartData = Object.keys(monthlyStatistics).map((key) => {
                const [year, month] = key.split("-");
                return {
                    year: parseInt(year, 10),
                    month: parseInt(month, 10),
                    users: monthlyStatistics[key].users,
                    doctors: monthlyStatistics[key].doctors,
                    revenue: monthlyStatistics[key].revenue,
                    totalFees: monthlyStatistics[key].totalFees,
                    doctorRevenue: monthlyStatistics[key].doctorRevenue,
                    adminRevenue: monthlyStatistics[key].adminRevenue,
                };
            });

            // Return the object with all the statistics and chart data
            return {
                totalDoctors,
                totalUsers,
                activeDoctors,
                activeUsers,
                totalRevenue: totalFees,
                doctorRevenue, // Revenue credited to doctors
                adminRevenue, // Revenue credited to admin
                userDoctorChartData, // Data for the user/doctor registration chart
            };
        } catch (error: any) {
            console.error("Error fetching statistics:", error.message);
            throw new Error(error.message);
        }
    }
}