import { AwsConfig } from "../../config/awsConfig";
import { ISlotRepository } from "../../interfaces/doctor/Slot.repository.interface";
import { ISlotService } from "../../interfaces/doctor/Slot.service.interface";


interface ITimeSlot {
    start: string;
    end: string;
}

export class SlotService implements ISlotService {
    private SlotRepository: ISlotRepository;
    private S3Service: AwsConfig;
    constructor(SlotRepository: ISlotRepository,
        S3Service: AwsConfig
    ) {
        this.SlotRepository = SlotRepository;
        this.S3Service = S3Service
    }

    private getFolderPathByFileType(fileType: string): string {
        switch (fileType) {
            case "profile image":
                return "curecue/doctorProfileImages";
            case "document":
                return "curecue/doctorDocuments";

            default:
                throw new Error(`Unknown file type: ${fileType}`);
        }
    }

    async scheduleSlot(date: string, timeSlots: ITimeSlot[], doctorId: string) {
        try {
            const parsedDate = new Date(date);


            // Format the timeSlots array to match the schema
            const formattedTimeSlots = timeSlots.map((slot: any) => ({
                start: new Date(slot.start),
                end: new Date(slot.end),
                isBooked: false,
                isOnHold: false,
                holdExpiresAt: null,
            }));

            const response = await this.SlotRepository.createSlot(
                parsedDate,
                formattedTimeSlots,
                doctorId
            );
            if (response?.status) {
                return { status: true };
            } else {
                throw new Error("Some of the slots here are already scheduled");
            }
        } catch (error: any) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }
    async checkSlots(doctorId: string, date: string) {
        try {
            const response = await this.SlotRepository.checkSlots(
                doctorId as string,
                date as string
            );

            if (response) {
                return response;
            }
        } catch (error: any) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }
    async checkAvialability(
        doctorId: string,
        date: string,
        start: string,
        end: string
    ) {
        try {
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
                throw new Error("Invalid date format");
            }

            const parsedStart = new Date(start);
            const parsedEnd = new Date(end);
            if (
                isNaN(parsedStart.getTime()) ||
                isNaN(parsedEnd.getTime()) ||
                parsedEnd <= parsedStart
            ) {
                throw new Error("Invalid start or end time");
            }

            const response = this.SlotRepository.checkAvialability(
                doctorId as string,
                parsedDate as Date,
                parsedStart as Date,
                parsedEnd as Date
            );

            if (response) {
                return response;
            }
        } catch (error: any) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }
    async deleteSlot(start: string, doctorId: string, date: string) {
        try {
            const reponse = await this.SlotRepository.deleteSlot(
                start as string,
                doctorId as string,
                date as string
            );
            if (reponse?.status) {
                return { status: true };
            }
        } catch (error: any) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }

    async checkStatus(email: string): Promise<any> {
        try {
            const response = this.SlotRepository.existUser(email);
            return response;
        } catch (error: any) {
            throw new Error(error);
        }
    }
}