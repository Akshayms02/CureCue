import { Request, Response } from "express";

import { chatService } from "../../services/chat/chat";

export class chatController {
    private chatService: chatService;

    constructor(chatService: chatService) {
        this.chatService = chatService;
    }

    getChat = async (req: Request, res: Response) => {
        try {
            const doctorID = req.query.doctorID as string;
            const userID = req.query.userID as string;
            const chatHistory = await this.chatService.getChat(doctorID, userID);
            res.status(200).json(chatHistory);
        } catch (error) {

            res.status(400).json(error);
        }
    };
    updateAppointment = async (req: Request, res: Response) => {
        try {
            const { appointmentId } = req.body;




            const response = await this.chatService.updateAppointment(appointmentId);

            res.status(200).json(response);
        } catch (error) {

            res.status(400).json(error);
        }
    };
}
