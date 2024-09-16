import { Router } from "express";
import { DoctorRepositary } from "../repositories/doctorRepository";
import DoctorController from "../controllers/doctorController";
import { doctorServices } from "../services/doctorServices";
import { refreshTokenHandler } from "../config/refreshTokenConfig";


const route = Router();

const doctorRepositary = new DoctorRepositary();
const doctorService = new doctorServices(doctorRepositary);

//UserService is injected into the doctorController's instance
const doctorController = new DoctorController(doctorService);

route.post("/signup", doctorController.register.bind(doctorController));
route.post("/verifyOtp", doctorController.verifyOtp.bind(doctorController));
route.post("/resendOtp", doctorController.resendOtp.bind(doctorController));
route.post("/login", doctorController.verifyLogin.bind(doctorController));
route.post("/refresh-token", refreshTokenHandler);

export default route;
