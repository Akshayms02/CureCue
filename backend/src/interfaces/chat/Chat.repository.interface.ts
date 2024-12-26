import { IAppointment } from "../../models/appointmentModel";

interface Message {
    sender: string;
    message: string;
    type: string;
}

interface Chat {
    doctorId: string;
    userId: string;
    messages: Message[];
}

interface Doctor {
    doctorId: string;
    name: string;
    image: string;
}

interface User {
    userId: string;
    name: string;
    image: string;
}

interface ChatWithParticipants {
    doctor: Doctor | null;
    user: User | null;
    chatResult: Chat | null;
}

interface MessageDetails {
    sender: 'doctor' | 'user';
    senderID: string;
    receiverID: string;
    message: string;
}

export interface IChatRepository {
    createChat(messageDetails: MessageDetails): Promise<Chat>;
    getChat(doctorID: string, userID: string): Promise<ChatWithParticipants>;
    updateAppointment(appointmentId: string): Promise<IAppointment>;
}