import { AwsConfig } from "../../config/awsConfig";
import { IAdminRepository } from "../../interfaces/admin/Admin.repository.interface";
import { IAdminService, IUserPaginationResult } from "../../interfaces/admin/Admin.service.interface";


export class AdminService implements IAdminService {
    constructor(
        private adminRepository: IAdminRepository,
        private S3Service: AwsConfig
    ) { }

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

    async addSpecialization(name: string, description: string) {
        try {
            // Call the repository method to create a new specialization
            const response = await this.adminRepository.createSpecialization(
                name,
                description
            );

            // Check if the response is valid
            if (response) {
                return response;
            } else {
                // Handle the case where the response is not as expected

                throw new Error(
                    "Something went wrong while creating the specialization."
                );
            }
        } catch (error: any) {
            // Log the error and rethrow it with a message

            throw new Error(`Failed to add specialization: ${error.message}`);
        }
    }

    async getSpecialization() {
        try {
            const response = await this.adminRepository.getAllSpecialization();

            // Check if the response is valid
            if (response) {
                return response;
            } else {
                // Handle the case where the response is not as expected

                throw new Error(
                    "Something went wrong while fetching the specialization."
                );
            }
        } catch (error: any) {
            // Log the error and rethrow it with a message

            throw new Error(`Failed to add specialization: ${error.message}`);
        }
    }

    async editSpecialization(id: number, name: string, description: string) {
        try {
            const response = await this.adminRepository.updateSpecialization(
                id,
                name,
                description
            );

            if (response) {
                return response;
            } else {
                throw new Error(
                    "Something went wrong while editing the specialization."
                );
            }
        } catch (error: any) {
            throw new Error(`Failed to edit specialization: ${error.message}`);
        }
    }

    async listUnlistSpecialization(id: number) {
        try {
            const response = await this.adminRepository.changeSpecializationStatus(
                id
            );

            // Check if the response is valid
            if (response) {
                return response;
            } else {
                // Handle the case where the response is not as expected

                throw new Error(
                    "Something went wrong while editing the specialization."
                );
            }
        } catch (error: any) {
            // Log the error and rethrow it with a message

            throw new Error(`Failed to edit specialization: ${error.message}`);
        }
    }

    async getAllUsersAndDoctors(role: string,search: any, sort: any, order: any, page: any, limit: any): Promise<IUserPaginationResult> {
        try {
            const searchFilter = search
                ? { name: { $regex: search, $options: 'i' } }
                : {};
            const sortOption = {
                [sort]: order === 'asc' ? 1 : -1,
            };
            const pageNumber = parseInt(page, 10) || 1;
            const pageSize = parseInt(limit, 10) || 10;
            const skip = (pageNumber - 1) * pageSize;

            const response = await this.adminRepository.getAllUsersAndDoctors(role,searchFilter, sortOption, skip, pageSize);
            return response;
        } catch (error: any) {
            throw new Error(`Failed to fetch users: ${error.message}`);
        }
    }

    async getDoctors() {
        try {
            const response = await this.adminRepository.getAllDoctors();

            if (response) {
                return response;
            } else {

                throw new Error("Something went wrong while fetching the user.");
            }
        } catch (error: any) {

            throw new Error(`Failed to user: ${error.message}`);
        }
    }

    async listUnlistUser(id: string) {
        try {
            const response = await this.adminRepository.changeUserStatus(id);

            // Check if the response is valid
            if (response) {
                return response;
            } else {
                // Handle the case where the response is not as expected

                throw new Error("Something went wrong while editing the user.");
            }
        } catch (error: any) {
            // Log the error and rethrow it with a message

            throw new Error(`Failed to edit user: ${error.message}`);
        }
    }

    async listUnlistDoctor(id: string) {
        try {
            const response = await this.adminRepository.changeDoctorStatus(id);

            // Check if the response is valid
            if (response) {
                return response;
            } else {
                // Handle the case where the response is not as expected

                throw new Error("Something went wrong while editing the user.");
            }
        } catch (error: any) {
            // Log the error and rethrow it with a message

            throw new Error(`Failed to edit user: ${error.message}`);
        }
    }

    async getAllDoctorApplications() {
        try {
            const response = await this.adminRepository.getAllApplications();
            if (response) {
                return response;
            } else {
                throw new Error(
                    "Something went wrong while fetching the details from the database"
                );
            }
        } catch (error: any) {
            throw new Error(error);
        }
    }

    async getDoctorApplication(id: string): Promise<any> {
        try {
            const response = await this.adminRepository.getSingleDoctorApplication(
                id as string
            );
            const files = [];
            if (response) {
                files.push(response.image);
                files.push(
                    response.kycDetails.certificateImage,
                    response.kycDetails.qualificationImage,
                    response.kycDetails.adharFrontImage,
                    response.kycDetails.adharBackImage
                );
                const signedFiles = await Promise.all(
                    files.map(async (file: { type: string; url: string }) => {
                        const folderPath = this.getFolderPathByFileType(file.type);
                        const signedUrl = await this.S3Service.getFile(
                            file.url,
                            folderPath
                        );
                        return { ...file, signedUrl };
                    })
                );
                return { response, signedFiles };
            }
        } catch (error: any) {
            throw new Error(error);
        }
    }

    async approveApplication(doctorId: string) {
        try {
            const response = await this.adminRepository.approveDoctor(doctorId);
            if (response) {
                return response;
            }
        } catch (error: any) {
            throw new Error(error);
        }
    }

    async getDoctorData(doctorId: string): Promise<any> {
        try {
            const response = await this.adminRepository.getDoctorData(
                doctorId as string
            );
            let imageUrl = "";

            if (response?.image) {
                const folderPath = this.getFolderPathByFileType(response?.image?.type);
                const signedUrl = await this.S3Service.getFile(
                    response.image.url,
                    folderPath
                );
                imageUrl = signedUrl;
            }

            const doctorInfo = {
                name: response?.name,
                email: response?.email,
                doctorId: response?.doctorId,
                phone: response?.phone,
                isBlocked: response?.isBlocked,
                docStatus: response?.kycStatus,
                DOB: response?.DOB,
                fees: response?.fees,
                gender: response?.gender,
                department: response?.department,
                image: imageUrl,
            };
            if (response) {
                return doctorInfo;
            }
        } catch (error: any) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }

    async getDashboardData() {
        try {


            const response = await this.adminRepository.getAllStatistics();

            if (response) {

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