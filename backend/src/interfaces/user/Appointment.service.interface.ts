import { IAppointment } from "../../models/appointmentModel";


export interface IAppointmentService {

    getSlots(
        doctorId: string,
        date: string
    ): Promise<{ start: Date; end: Date; isAvailable: boolean }[]>;

    holdSlot(
        doctorId: string,
        date: Date,
        startTime: Date,
        userId: string,
        holdDurationMinutes?: number
    ): Promise<{ success: boolean; message: string }>;
    checkHold(
        doctorId: string,
        date: Date,
        startTime: Date
    ): Promise<
        {
            slotId: string;
            userId: string;
            isOnHold: boolean;
            timeSlots: [{ start: Date; end: Date; isOnHold: boolean }];
        }[]
    >;

    getAppointments(
        userId: string,
        status: string,
        page: number,
        limit: number
    ): Promise<{ appointments: IAppointment[]; totalPages: number }>;

    addReview(
        appointmentId: string,
        rating: number,
        review: string
    ): Promise<IAppointment>

    getAppointment(appointmentId: string): Promise<IAppointment>;

};