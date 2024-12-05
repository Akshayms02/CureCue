import { Request, Response } from "express";

interface IDoctorController {
    register(req: Request, res: Response): Promise<void>;
    verifyOtp(req: Request, res: Response): Promise<void>;
    verifyLogin(req: Request, res: Response): Promise<void>;
    doctorLogout(req: Request, res: Response): Promise<void>;
    resendOtp(req: Request, res: Response): Promise<void>;
    uploadDoctorDetails(req: Request, res: Response): Promise<void>;
    checkStatus(req: Request, res: Response): Promise<void>;
    scheduleSlots(req: Request, res: Response): Promise<void>;
    checkAvialableSlots(req: Request, res: Response): Promise<void>;
    deleteSlot(req: Request, res: Response): Promise<void>;
    checkAvialability(req: Request, res: Response): Promise<void>;
    getDoctorData(req: Request, res: Response): Promise<void>;
    getAppointments(req: Request, res: Response): Promise<void>;
    updateDoctorProfile(req: Request, res: Response): Promise<void>;
    getDashboardData(req: Request, res: Response): Promise<void>;
    addPrescription(req: Request, res: Response): Promise<void>;
    getWallet(req: Request, res: Response): Promise<void>;
}

export default IDoctorController;
