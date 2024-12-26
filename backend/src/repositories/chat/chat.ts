import { IChatRepository } from "../../interfaces/chat/Chat.repository.interface";
import appointmentModel from "../../models/appointmentModel";
import ChatModel from "../../models/chatModel";
import doctorModel from "../../models/doctorModel";
import userModel from "../../models/userModel";

export class chatRepository implements IChatRepository {
    async createChat(messageDetails: any) {
        try {

            const query =
                messageDetails.sender === "doctor"
                    ? {
                        doctorId: messageDetails.senderID,
                        userId: messageDetails.receiverID,
                    }
                    : {
                        doctorId: messageDetails.receiverID,
                        userId: messageDetails.senderID,
                    };


            const existingChat = await ChatModel.findOneAndUpdate(
                query,
                {

                    $push: {
                        messages: {
                            sender: messageDetails.sender,
                            message: messageDetails.message,
                            type: "txt",
                        },
                    },
                },
                { new: true, upsert: true }
            );

            return existingChat;
        } catch (error: any) {
            console.error("Error in chatRepository:", error);
            throw error; // Propagate the error
        }
    }

    getChat = async (doctorID: string, userID: string): Promise<any> => {
        try {
            const chatResult = await ChatModel.findOne({
                doctorId: doctorID,
                userId: userID,
            });

            const user = await userModel.findOne(
                { userId: userID },
                { name: 1, image: 1 }
            );

            const doctor = await doctorModel.findOne(
                { doctorId: doctorID },
                {
                    name: 1,
                    image: 1,
                }
            );
            return {
                doctor: doctor,
                user: user,
                chatResult,
            };
        } catch (error) {
            console.error("Error retrieving chat:", error);
            throw new Error("Failed to retrieve chat");
        }
    };

    updateAppointment = async (appointmentId: string): Promise<any> => {
        const result = await appointmentModel.findByIdAndUpdate(
            appointmentId,
            { status: "prescription pending" },
            { new: true }
        );

        return result;
    };
}
