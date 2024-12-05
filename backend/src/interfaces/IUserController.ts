import { Request, Response } from "express";

export interface IUserController {
  register(req: Request, res: Response): Promise<any>;
  verifyOtp(req: Request, res: Response): Promise<void>;
  verifyLogin(req: Request, res: Response): Promise<void>;
  resendOtp(req: Request, res: Response): Promise<void>;
  checkStatus(req: Request, res: Response): Promise<void>;
  logoutUser(req: Request, res: Response): Promise<void>;
  getDoctors(req: Request, res: Response): Promise<void>;
  getSpecializations(req: Request, res: Response): Promise<void>;
  getDepDoctors(req: Request, res: Response): Promise<void>;
  getDoctorData(req: Request, res: Response): Promise<void>;
  getSlots(req: Request, res: Response): Promise<void>;
  createAppointment(req: Request, res: Response): Promise<any>;
  holdSlot(req: Request, res: Response): Promise<any>;
  updateUserProfile(req: Request, res: Response): Promise<any>;
  getAllAppointments(req: Request, res: Response): Promise<void>;
  getAppointment(req: Request, res: Response): Promise<void>;
  addReview(req: Request, res: Response): Promise<void>;
  getReviews(req: Request, res: Response): Promise<void>;
}
