import { Router } from "express";
// import { DoctorRepository } from "../repositories/doctorRepository";
// import DoctorController from "../controllers/doctorController";
// import { doctorServices } from "../services/doctorServices";
import { refreshTokenHandler } from "../config/refreshTokenConfig";
import multer from "multer";
import { AwsConfig } from "../config/awsConfig";
import { verifyDocToken } from "../config/jwtConfig";
import { DoctorRepository } from "../repositories/doctor/Doctor";
import { DoctorService } from "../services/doctor/Doctor";
import { DoctorController } from "../controllers/doctor/Doctor";
import { AuthRepository } from "../repositories/doctor/Auth";
import { AuthService } from "../services/doctor/Auth";
import { AuthController } from "../controllers/doctor/Auth";
import { SlotRepository } from "../repositories/doctor/Slot";
import { SlotService } from "../services/doctor/Slot";
import { SlotController } from "../controllers/doctor/Slot";
import { AppointmentRepository } from "../repositories/doctor/Appointment";
import { AppointmentService } from "../services/doctor/Appointment";
import { AppointmentController } from "../controllers/doctor/Appointment";

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
const DoctorRepositoryInstance = new DoctorRepository();
const S3ServiceInstance = new AwsConfig();
const DoctorServiceInstance = new DoctorService(DoctorRepositoryInstance, S3ServiceInstance);
const DoctorControllerInstance = new DoctorController(DoctorServiceInstance);


const AuthRepositoryInstance = new AuthRepository();
const AuthServiceInstance = new AuthService(AuthRepositoryInstance, S3ServiceInstance);
const AuthControllerInstance = new AuthController(AuthServiceInstance);

const SlotRepositoryInstance = new SlotRepository();
const SlotServiceInstance = new SlotService(SlotRepositoryInstance, S3ServiceInstance);
const SlotControllerInstance = new SlotController(SlotServiceInstance);

const AppointmentRepositoryInstance = new AppointmentRepository();
const AppointmentServiceInstance = new AppointmentService(AppointmentRepositoryInstance);
const AppointmentControllerInstance = new AppointmentController(AppointmentServiceInstance);

// const doctorRepositary = new DoctorRepository();
// const S3Service = new AwsConfig();
// const doctorService = new doctorServices(doctorRepositary, S3Service);

// //UserService is injected into the doctorController's instance
// const doctorController = new DoctorController(doctorService);







route.post("/signup", AuthControllerInstance.register.bind(AuthControllerInstance));
route.post("/verifyOtp", AuthControllerInstance.verifyOtp.bind(AuthControllerInstance));
route.post("/resendOtp", AuthControllerInstance.resendOtp.bind(AuthControllerInstance));
route.post("/login", AuthControllerInstance.verifyLogin.bind(AuthControllerInstance));
route.post("/logout", AuthControllerInstance.doctorLogout.bind(AuthControllerInstance));
route.post(
  "/uploadDoctorKycDetails",
  verifyDocToken,
  uploadDoctorDataFiles,
  DoctorControllerInstance.uploadDoctorDetails.bind(DoctorControllerInstance)
);
route.get(
  "/check-status/:email",
  // verifyDocToken,
  DoctorControllerInstance.checkStatus.bind(DoctorControllerInstance)
);
route.post(
  "/slots",
  verifyDocToken,
  SlotControllerInstance.scheduleSlots.bind(SlotControllerInstance)
);

route.get(
  "/checkslots",
  verifyDocToken,
  SlotControllerInstance.checkAvialableSlots.bind(SlotControllerInstance)
);

route.post(
  "/deleteSlot",
  verifyDocToken,
  SlotControllerInstance.deleteSlot.bind(SlotControllerInstance)
);

route.post(
  "/checkAvialability",
  verifyDocToken,
  SlotControllerInstance.checkAvialability.bind(SlotControllerInstance)
);

route.post("/refresh-token", refreshTokenHandler);

route.get(
  "/getDoctorData/:doctorId",
  verifyDocToken,
  DoctorControllerInstance.getDoctorData.bind(DoctorControllerInstance)
);

route.get(
  "/appointments/:doctorId",
  verifyDocToken,
  AppointmentControllerInstance.getAppointments.bind(AppointmentControllerInstance)
);

route.put(
  "/updateDoctor",
  verifyDocToken,
  DoctorControllerInstance.updateDoctorProfile.bind(DoctorControllerInstance)
);

route.get(
  "/dashboardData",

  DoctorControllerInstance.getDashboardData.bind(DoctorControllerInstance)
);

route.get(
  "/getWallet/:doctorId",
  verifyDocToken,
  DoctorControllerInstance.getWallet.bind(DoctorControllerInstance)
);
route.put(
  "/addPrescription",
  AppointmentControllerInstance.addPrescription.bind(AppointmentControllerInstance)
);
route.post(
  "/withdraw/:doctorId",
  verifyDocToken,
  DoctorControllerInstance.withdraw.bind(DoctorControllerInstance)
);

route.get(
  "/getMedicalRecords/:userId",
  verifyDocToken,
  AppointmentControllerInstance.getMedicalRecords.bind(AppointmentControllerInstance)
);

route.put(
  "/cancelAppointment",
  verifyDocToken,
  AppointmentControllerInstance.cancelAppointment.bind(AppointmentControllerInstance)
);

export default route;
