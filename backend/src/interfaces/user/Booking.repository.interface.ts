import mongoose from "mongoose";
import { IAppointment } from "../../models/appointmentModel";


export interface IBookingRepository {
    createAppointment(
        data: any,
        session: mongoose.ClientSession
    ): Promise<IAppointment>;
    cancelAppointment(appointmentId: string): Promise<any>;
    bookSlot(
        slot: {
            slotId: string;
            doctorId: string;
            userId: string;
            startTime: Date;
            endTime: Date;
        },
        userId: string,
        session: mongoose.ClientSession
    ): Promise<IAppointment>;

    findAvailableSlot(
        doctorId: string,
        userId: string,
        start: string,
        date: Date,
        session: mongoose.ClientSession
    ): Promise<{
        slotId: string;
        doctorId: string;
        userId: string;
        startTime: Date;
        endTime: Date;
        timeSlots: [{ start: Date; end: Date }];
    } | null>;


    getDoctorReview(doctorId: string): Promise<{
        doctorId: string;
        reviews: { rating: number; reviewText: string }[];
        image: { type: string; url: string };
    }>;

};