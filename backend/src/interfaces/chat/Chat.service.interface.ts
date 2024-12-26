import { IAppointment } from "../../models/appointmentModel";


interface MessageDetails {
    sender: 'doctor' | 'user';
    senderID: string;
    receiverID: string;
    message: string;
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
interface Message {
    sender: string;
    message: string;
    type: string;
}
interface ChatWithParticipants {
    doctor: Doctor | null;
    user: User | null;
    chatResult: Chat | null;
}


interface Chat {
    doctorId: string;
    userId: string;
    messages: Message[];
}


export interface IChatService {
    createChat(messageDetails: MessageDetails): Promise<Chat>;
    updateAppointment(appointmentId: string): Promise<IAppointment>;
    getChat(doctorID: string, userID: string): Promise<
        ChatWithParticipants>;
}