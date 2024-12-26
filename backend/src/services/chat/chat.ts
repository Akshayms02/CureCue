import { chatRepository } from "../../repositories/chat/chat";
import { AwsConfig } from "../../config/awsConfig";
import { IChatService } from "../../interfaces/chat/Chat.service.interface";

const S3Service = new AwsConfig();
export class chatService implements IChatService {
    private chatRepository: chatRepository;

    constructor(chatRepository: chatRepository) {
        this.chatRepository = chatRepository;
    }

    async createChat(messageDetails: any) {
        try {

            const savedChat = await this.chatRepository.createChat(messageDetails);
            return savedChat;
        } catch (error: any) {
            console.error("Error in chatService.createChat:", error);
            throw new Error("Failed to create chat");
        }
    }
    async updateAppointment(appointmentId: string): Promise<any> {

        return await this.chatRepository.updateAppointment(appointmentId);
    }

    async getChat(doctorID: string, userID: string): Promise<any> {
        try {
            const response = await this.chatRepository.getChat(doctorID, userID);
            let signedDoctorUrl: string | undefined;
            let signedUserUrl: string | undefined;
            if (
                response?.doctor.image &&
                response.doctor.image.url &&
                response.doctor.image.type
            ) {
                const folderPath = this.getFolderPathByFileType(
                    response.doctor.image.type
                );
                signedDoctorUrl = await S3Service.getFile(
                    response.doctor.image.url,
                    folderPath
                );
            }
            if (
                response?.user.image &&
                response.user.image.url &&
                response.user.image.type
            ) {
                const folderPath = this.getFolderPathByFileType(
                    response.user.image.type
                );
                signedUserUrl = await S3Service.getFile(
                    response.user.image.url,
                    folderPath
                );
            }
            return {
                ...response,
                signedDoctorImageUrl: signedDoctorUrl,
                signedUserImageUrl: signedUserUrl,
            };
        } catch (error: any) {
            console.error("Error in chatService.getChat:", error);
            throw new Error("Failed to retrieve chat");
        }
    }
    private getFolderPathByFileType(fileType: string): string {
        switch (fileType) {
            case "profile image":
                return "cureCue/doctorProfileImages";
            case "document":
                return "cureCue/doctorDocuments";
            case "user profile image":
                return "cureCue/userProfileImages";

            default:
                throw new Error(`Unknown file type: ${fileType}`);
        }
    }
}
