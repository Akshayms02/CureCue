import { Router } from "express";
import { DoctorRepository } from "../repositories/doctorRepository";
import DoctorController from "../controllers/doctorController";
import { doctorServices } from "../services/doctorServices";
import { refreshTokenHandler } from "../config/refreshTokenConfig";
import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

// Define the middleware for handling file uploads
const uploadDoctorDataFiles = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "aadhaarFrontImage", maxCount: 1 },
  { name: "aadhaarBackImage", maxCount: 1 },
  { name: "certificateImage", maxCount: 1 },
  { name: "qualificationImage", maxCount: 1 },
]);

const route = Router();

const doctorRepositary = new DoctorRepository();

const doctorService = new doctorServices(doctorRepositary);

//UserService is injected into the doctorController's instance
const doctorController = new DoctorController(doctorService);

route.post("/signup", doctorController.register.bind(doctorController));
route.post("/verifyOtp", doctorController.verifyOtp.bind(doctorController));
route.post("/resendOtp", doctorController.resendOtp.bind(doctorController));
route.post("/login", doctorController.verifyLogin.bind(doctorController));
route.post("/refresh-token", refreshTokenHandler);

export default route;
