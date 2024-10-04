import { Router } from "express";
import { DoctorRepository } from "../repositories/doctorRepository";
import DoctorController from "../controllers/doctorController";
import { doctorServices } from "../services/doctorServices";
import { refreshTokenHandler } from "../config/refreshTokenConfig";
import multer from "multer";
import { AwsConfig } from "../config/awsConfig";

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
const S3Service = new AwsConfig();
const doctorService = new doctorServices(doctorRepositary, S3Service);

//UserService is injected into the doctorController's instance
const doctorController = new DoctorController(doctorService);

route.post("/signup", doctorController.register.bind(doctorController));
route.post("/verifyOtp", doctorController.verifyOtp.bind(doctorController));
route.post("/resendOtp", doctorController.resendOtp.bind(doctorController));
route.post("/login", doctorController.verifyLogin.bind(doctorController));
route.post("/logout", doctorController.doctorLogout.bind(doctorController));
route.post(
  "/uploadDoctorKycDetails",
  uploadDoctorDataFiles,
  doctorController.uploadDoctorDetails.bind(doctorController)
);
route.get(
  "/check-status/:email",
  doctorController.checkStatus.bind(doctorController)
);
route.post("/slots", doctorController.scheduleSlots.bind(doctorController));

route.get(
  "/checkslots",
  doctorController.checkAvialableSlots.bind(doctorController)
);

route.post("/deleteSlot", doctorController.deleteSlot.bind(doctorController));

route.post("/checkAvialability",doctorController.checkAvialability.bind(doctorController))

route.post("/refresh-token", refreshTokenHandler);

export default route;
