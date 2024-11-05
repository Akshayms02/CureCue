import { chatRepository } from "../repositories/chatRepository";

export class chatService {
  private chatRepository: chatRepository;

  constructor(chatRepository: chatRepository) {
    this.chatRepository = chatRepository;
  }

  async createChat(messageDetails: any): Promise<any> {
    try {
      // Use this.chatRepository to call the repository method
      console.log(messageDetails)
      const savedChat = await this.chatRepository.createChat(messageDetails);
      return savedChat;
    } catch (error: any) {
      console.error("Error in chatService.createChat:", error);
      throw new Error("Failed to create chat"); // Adding context to the error
    }
  }

  async getChat(doctorID: string, userID: string): Promise<any> {
    try {
      return await this.chatRepository.getChat(doctorID, userID);
    } catch (error: any) {
      console.error("Error in chatService.getChat:", error);
      throw new Error("Failed to retrieve chat"); // Adding context to the error
    }
  }
}

