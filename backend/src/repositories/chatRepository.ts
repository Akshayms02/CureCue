import ChatModel from "../models/chatModel";

export class chatRepository {
  async createChat(messageDetails: any) {
    try {
      // Determine whether the sender is a doctor or a user and adjust the query accordingly
      const query =
        messageDetails.sender === "doctor"
          ? {
              doctorId: messageDetails.senderID, // Sender is doctor
              userId: messageDetails.receiverID,
            }
          : {
              doctorId: messageDetails.receiverID, // Sender is user
              userId: messageDetails.senderID,
            };

      // Check if chat between the user and doctor exists, and update or create the chat document
      const existingChat = await ChatModel.findOneAndUpdate(
        query,
        {
          // Push a new message to the messages array
          $push: {
            messages: {
              sender: messageDetails.sender,
              message: messageDetails.message,
              type: "txt",
            },
          },
        },
        { new: true, upsert: true } // 'upsert' creates a new document if none exists
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
      return chatResult;
    } catch (error) {
      console.error("Error retrieving chat:", error);
      throw new Error("Failed to retrieve chat");
    }
  };
}
