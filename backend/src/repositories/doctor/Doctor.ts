import { IDoctorRepository } from "../../interfaces/doctor/Doctor.repository.interface";
import { docDetails, DoctorData } from "../../interfaces/doctorInterfaces";
import appointmentModel from "../../models/appointmentModel";
import doctorApplicationModel from "../../models/doctorApplicationModel";
import doctorModel, { IDoctor } from "../../models/doctorModel";
import walletModel, { ITransaction } from "../../models/walletModel";


export class DoctorRepository implements IDoctorRepository {
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

    async existUser(email: string): Promise<IDoctor| null> {
        return await doctorModel.findOne({ email });
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
}