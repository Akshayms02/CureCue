import { AwsConfig } from "../../config/awsConfig";
import { IUserRepository } from "../../interfaces/user/User.repository.interface";
import { IUserService } from "../../interfaces/user/User.service.interface";
import bcrypt from "bcrypt";


export class UserService implements IUserService {
    private UserRepository: IUserRepository;
    private S3Service: AwsConfig;
    constructor(UserRepository: IUserRepository, S3Service: AwsConfig) {
        this.UserRepository = UserRepository
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

    async getSpecialization(page: number, limit: number) {
        try {
            const skip = (page - 1) * limit;

            const { specializations, total } =
                await this.UserRepository.getSpecializations(skip, limit);

            const totalPages = Math.ceil(total / limit);

            return {
                specializations,
                totalPages,
                currentPage: page,
            };
        } catch (error: any) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("Error fetching specializations");
        }
    }

    async checkStatus(email: string): Promise<any> {
        try {
            const response = this.UserRepository.existUser(email);
            return response;
        } catch (error: any) {
            throw new Error(error);
        }
    }


    async getDepDoctors(departmentId: string): Promise<any> {
        try {
            const response = await this.UserRepository.getDepDoctors(departmentId);
            console.log(departmentId);
            const docs = await Promise.all(
                response.map(async (doctor: any) => {
                    let profileUrl = "";
                    if (doctor?.image?.url) {
                        const filePath = this.getFolderPathByFileType(doctor?.image?.type);
                        profileUrl = await this.S3Service.getFile(
                            doctor?.image?.url,
                            filePath
                        );
                    }
                    return {
                        name: doctor?.name,
                        email: doctor?.email,
                        profileUrl: profileUrl,
                        doctorId: doctor?.doctorId,
                        department: doctor?.department.name,
                    };
                })
            );

            return docs;
        } catch (error: any) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }

    async getAllDoctors() {
        try {
            const response = await this.UserRepository.getDoctors();

            const docs = await Promise.all(
                response.map(async (doctor: any) => {
                    let profileUrl = "";
                    if (doctor?.image?.url) {
                        const filePath = this.getFolderPathByFileType(doctor?.image?.type);
                        profileUrl = await this.S3Service.getFile(
                            doctor?.image?.url,
                            filePath
                        );
                    }
                    return {
                        name: doctor?.name,
                        email: doctor?.email,
                        profileUrl: profileUrl,
                        doctorId: doctor?.doctorId,
                        department: doctor?.department.name,
                    };
                })
            );
            return docs;
        } catch (error: any) {
            throw new Error(error);
        }
    }

    async getDoctorData(doctorId: string): Promise<any> {
        try {
            const response = await this.UserRepository.getDoctorData(
                doctorId as string
            );
            if (response) {
                let profileUrl = "";
                if (response?.image?.url) {
                    const filePath = this.getFolderPathByFileType(response?.image?.type);
                    profileUrl = await this.S3Service.getFile(
                        response?.image?.url,
                        filePath
                    );
                    if (profileUrl) {
                        response.profileUrl = profileUrl;
                    }
                }
                console.log(response);

                return response;
            }
        } catch (error: any) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }

    async getReviewData(doctorId: string) {
        try {
            const response = await this.UserRepository.getDoctorReview(doctorId);

            if (response?.image && response.image.url && response.image.type) {
                const folderPath = this.getFolderPathByFileType(response.image.type);
                const signedUrl = await this.S3Service.getFile(
                    response.image.url,
                    folderPath
                );

                return {
                    ...response,
                    signedImageUrl: signedUrl,
                };
            }
        } catch (error: any) {
            console.error("Error in getDoctor:", error.message);
            throw new Error(`Failed to get specialization: ${error.message}`);
        }
    }

    async getSlots(
        doctorId: string,
        date: string
    ): Promise<{ start: Date; end: Date; isAvailable: boolean }[]> {
        try {
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
                throw new Error("Invalid date format");
            }

            const response = await this.UserRepository.getSlots(doctorId, parsedDate);

            if (!response) {
                throw new Error("No response received from the repository");
            }

            return response;
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Unknown error occurred";
            throw new Error(errorMessage);
        }
    }
    async updateProfile(updateData: {
        userId: string;
        name: string;
        DOB: string;
        gender: string;
        phone: string;
        email: string;
    }): Promise<{
        name: string;
        email: string;
        userId: string;
        phone: string;
        isBlocked: boolean;
    }> {
        try {
            const updatedUser = await this.UserRepository.updateProfile(updateData);

            if (updatedUser.image != null) {
                const folderPath = this.getFolderPathByFileType(updatedUser.image.type);
                const signedUrl = await this.S3Service.getFile(
                    updatedUser.image.url,
                    folderPath
                );

                updatedUser.image.url = signedUrl;
            }

            const userInfo = {
                name: updatedUser.name,
                email: updatedUser.email,
                userId: updatedUser.userId,
                phone: updatedUser.phone,
                isBlocked: updatedUser.isBlocked,
            };

            return userInfo;
        } catch (error: any) {
            console.error("Error in updateProfile:", error.message);
            throw new Error(`Failed to update profile: ${error.message}`);
        }
    }

    async changePassword(
        userId: string,
        currentPassword: string,
        newPassword: string
    ): Promise<any> {
        const user = await this.UserRepository.getUserById(userId);

        if (!user) {
            throw new Error("User not found.");
        }

        const isPasswordValid = await bcrypt.compare(
            currentPassword,
            user.password
        );
        if (!isPasswordValid) {
            throw new Error("Current password is incorrect.");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.UserRepository.updatePassword(userId, hashedPassword);
    }
}