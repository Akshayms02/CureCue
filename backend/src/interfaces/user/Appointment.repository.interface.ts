import { IAppointment } from "../../models/appointmentModel";



export interface IAppointmentRepository {
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
    getAllAppointments(
        userId: string,
        status: string,
        page: number,
        limit: number
    ): Promise<{ appointments: IAppointment[]; totalPages: number }>;
    cancelAppointment(appointmentId: string): Promise<any>;
    addReview(
        appointmentId: string,
        rating: number,
        reviewText: string
    ): Promise<IAppointment>;

    holdSlot(
        doctorId: string,
        date: Date,
        startTime: Date,
        userId: string,
        holdDurationMinutes: number
    ): Promise<any>
    getAppointment(appointmentId: string): Promise<IAppointment | null>;
    getSlots(
        doctorId: string,
        date: Date
    ): Promise<{ start: Date; end: Date; isAvailable: boolean }[]>;

};