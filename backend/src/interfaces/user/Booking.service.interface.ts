import { IAppointment } from "../../models/appointmentModel";



export interface IBookingService {

    createAppointment(data: any): Promise<IAppointment>;
    cancelAppointment(appointmentId: string): Promise<any>;

};