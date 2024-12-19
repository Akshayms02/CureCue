import { AwsConfig } from "../../config/awsConfig";
import { IDoctorRepository } from "../../interfaces/doctor/Doctor.repository.interface";
import { IDoctorService } from "../../interfaces/doctor/Doctor.service.interface";
import { docDetails, DoctorData, DoctorFiles, FileData } from "../../interfaces/doctorInterfaces";
import { IWallet } from "../../models/walletModel";


export class DoctorService implements IDoctorService {
    private DoctorRepository: IDoctorRepository;
    private S3Service: AwsConfig;
    constructor(DoctorRepository: IDoctorRepository,
        S3Service: AwsConfig
    ) {
        this.DoctorRepository = DoctorRepository;
        this.S3Service = S3Service
    }

    private getFolderPathByFileType(fileType: string): string {
        switch (fileType) {
            case "profile image":
                return "cureCue/doctorProfileImages";
            case "document":
                return "cureCue/doctorDocuments";

            default:
                throw new Error(`Unknown file type: ${fileType}`);
        }
    }

    async getWallet(
        doctorId: string,
        status: string,
        page: number,
        limit: number
    ): Promise<IWallet> {
        try {
            const response = await this.DoctorRepository.getWalletDetails(
                doctorId,
                status,
                page,
                limit
            );
            return response;
        } catch (error: any) {
            console.error("Error in getWallet:", error.stack || error.message);
            throw new Error(`Failed to get wallet details: ${error.message}`);
        }
    }

    async checkStatus(
        email: string
    ): Promise<{ isBlocked: boolean; kycStatus: string } | undefined> {
        try {
            const user = await this.DoctorRepository.existUser(email);
            if (!user) {
                throw new Error("User not found");
            }
            return {
                isBlocked: user.isBlocked as boolean,
                kycStatus: user.kycStatus as string,
            };
        } catch (error: any) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }

    async uploadDoctorData(data: DoctorData, files: DoctorFiles) {
        try {
            const docDetails: docDetails = {
                profileUrl: { type: "", url: "" },
                aadhaarFrontImageUrl: { type: "", url: "" },
                aadhaarBackImageUrl: { type: "", url: "" },
                certificateUrl: { type: "", url: "" },
                qualificationUrl: { type: "", url: "" },
            };

            const uploadFileAndAssign = async (
                folder: string,
                file: FileData,
                docKey: keyof docDetails,
                docType: string
            ) => {
                const fileUrl = await this.S3Service.uploadFile(folder, file);
                docDetails[docKey] = { url: fileUrl, type: docType };
            };

            const uploadPromises: Promise<void>[] = [];

            if (files.image) {
                uploadPromises.push(
                    uploadFileAndAssign(
                        "cureCue/doctorProfileImages/",
                        files.image[0],
                        "profileUrl",
                        "profile image"
                    )
                );
            }
            if (files.aadhaarFrontImage) {
                uploadPromises.push(
                    uploadFileAndAssign(
                        "cureCue/doctorDocuments/",
                        files.aadhaarFrontImage[0],
                        "aadhaarFrontImageUrl",
                        "document"
                    )
                );
            }
            if (files.aadhaarBackImage) {
                uploadPromises.push(
                    uploadFileAndAssign(
                        "cureCue/doctorDocuments/",
                        files.aadhaarBackImage[0],
                        "aadhaarBackImageUrl",
                        "document"
                    )
                );
            }
            if (files.certificateImage) {
                uploadPromises.push(
                    uploadFileAndAssign(
                        "cureCue/doctorDocuments/",
                        files.certificateImage[0],
                        "certificateUrl",
                        "document"
                    )
                );
            }
            if (files.qualificationImage) {
                uploadPromises.push(
                    uploadFileAndAssign(
                        "cureCue/doctorDocuments/",
                        files.qualificationImage[0],
                        "qualificationUrl",
                        "document"
                    )
                );
            }

            await Promise.all(uploadPromises);

            const response = await this.DoctorRepository.uploadDoctorData(
                data,
                docDetails
            );

            if (response) {
                return response;
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async withdraw(doctorId: string, withdrawalAmount: number) {
        try {
            const response = await this.DoctorRepository.withdrawMoney(
                doctorId,
                withdrawalAmount
            );

            return response;
        } catch (error: any) {
            console.error("Error in withdraw:", error.stack || error.message);
            throw new Error(`Failed to withdraw: ${error.message}`);
        }
    }

    async getDoctorData(doctorId: string) {
        try {
            const response = await this.DoctorRepository.getDoctorData(doctorId);
            let imageUrl = "";
            console.log(response);

            if (response?.image) {
                const folderPath = this.getFolderPathByFileType(response?.image?.type);
                const signedUrl = await this.S3Service.getFile(
                    response.image.url,
                    folderPath
                );
                imageUrl = signedUrl;
            }
            response.imageUrl = imageUrl;
            console.log(response);
            if (response) {
                return response;
            }
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
    }): Promise<any> {
        try {
            console.log(updateData);
            const updatedDoctor = await this.DoctorRepository.updateProfile(
                updateData
            );
            let imageUrl = "";

            if (updatedDoctor?.image) {
                const folderPath = this.getFolderPathByFileType(
                    updatedDoctor?.image?.type
                );
                const signedUrl = await this.S3Service.getFile(
                    updatedDoctor.image.url,
                    folderPath
                );
                imageUrl = signedUrl;
            }

            const doctorInfo = {
                name: updatedDoctor.name,
                email: updatedDoctor.email,
                doctorId: updatedDoctor.doctorId,
                phone: updatedDoctor.phone,
                isBlocked: updatedDoctor.isBlocked,
                docStatus: updatedDoctor.kycStatus,
                DOB: updatedDoctor.DOB,
                fees: updatedDoctor.fees,
                gender: updatedDoctor.gender,
                department: updatedDoctor.department,
                image: imageUrl,
            };

            return { doctorInfo };
        } catch (error: any) {
            console.error("Error in updateProfile:", error.message);
            throw new Error(`Failed to update profile: ${error.message}`);
        }
    }
    async getDashboardData(doctorId: string) {
        try {
            console.log("Entering getDashboardData method in docService");

            const response = await this.DoctorRepository.getAllStatistics(
                doctorId as string
            );

            if (response) {
                console.log("Dashboarddd data successfully retrieved:", response);
                return response;
            } else {
                console.error("Failed to retrieve dashboard data: Response is invalid");
                throw new Error(
                    "Something went wrong while retrieving dashboard data."
                );
            }
        } catch (error: any) {
            console.error("Error in getDashboardData:", error.message);
            throw new Error(`Failed to retrieve dashboard data: ${error.message}`);
        }
    }

}