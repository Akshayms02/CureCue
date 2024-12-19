import { Router } from "express";
import { refreshTokenHandler } from "../config/refreshTokenConfig";
import { AwsConfig } from "../config/awsConfig";
import { verifyToken } from "../config/jwtConfig";
import userAuth from "../config/Auth";
import { AuthRepository } from "../repositories/user/Auth";
import { AuthService } from "../services/user/Auth";
import { AuthController } from "../controllers/user/Auth";
import { UserRepository } from "../repositories/user/User";

import { UserService } from "../services/user/User";
import { UserController } from "../controllers/user/User";
import { AppointmentRepository } from "../repositories/user/Appointment";
import { AppointmentService } from "../services/user/Appointment";
import { AppointmentController } from "../controllers/user/Appointment";
import { BookingRepository } from "../repositories/user/Booking";
import { BookingService } from "../services/user/Booking";
import { BookingController } from "../controllers/user/Booking";

const route = Router();

const AuthRepositoryInstance = new AuthRepository();
const AuthServiceInstance = new AuthService(AuthRepositoryInstance);
const AuthControllerInstance = new AuthController(AuthServiceInstance);
const S3ServiceInstance = new AwsConfig()

const UserRepositoryInstance = new UserRepository();
const UserServiceInstance = new UserService(UserRepositoryInstance, S3ServiceInstance);
const UserControllerInstance = new UserController(UserServiceInstance);

const AppointmentRepositoryInstance = new AppointmentRepository();
const AppointmentServiceInstance = new AppointmentService(AppointmentRepositoryInstance);
const AppointmentControllerInstance = new AppointmentController(AppointmentServiceInstance);

const BookingRepositoryInstance = new BookingRepository();
const BookingServiceInstance = new BookingService(BookingRepositoryInstance);
const BookingControllerInstance = new BookingController(BookingServiceInstance);


route.post("/signup", AuthControllerInstance.register.bind(AuthControllerInstance));
route.post("/verifyOtp", AuthControllerInstance.verifyOtp.bind(AuthControllerInstance));
route.post("/resendOtp", AuthControllerInstance.resendOtp.bind(AuthControllerInstance));
route.post("/login", AuthControllerInstance.verifyLogin.bind(AuthControllerInstance));
route.get(
  "/check-status/:email",
  verifyToken,
  UserControllerInstance.checkStatus.bind(UserControllerInstance)
);
route.post("/logout", AuthControllerInstance.logoutUser.bind(AuthControllerInstance));
route.get("/getDoctors", UserControllerInstance.getDoctors.bind(UserControllerInstance));
route.get(
  "/specializations",
  UserControllerInstance.getSpecializations.bind(UserControllerInstance)
);
route.get("/getDepDoctors", UserControllerInstance.getDepDoctors.bind(UserControllerInstance));
route.get(
  "/getDoctorData/:doctorId",
  UserControllerInstance.getDoctorData.bind(UserControllerInstance)
);
route.get(
  "/getSlots/:doctorId/:date",
  AppointmentControllerInstance.getSlots.bind(AppointmentControllerInstance)
);
route.post(
  "/createAppointment",
  verifyToken,
  BookingControllerInstance.createAppointment.bind(BookingControllerInstance)
);
route.post(
  "/holdTimeslot",
  verifyToken,
  AppointmentControllerInstance.holdSlot.bind(AppointmentControllerInstance)
);
route.put(
  "/updateUser",
  verifyToken, userAuth,
  UserControllerInstance.updateUserProfile.bind(UserControllerInstance)
);
route.get(
  "/getAppointments/:userId",
  verifyToken,
  AppointmentControllerInstance.getAllAppointments.bind(AppointmentControllerInstance)
);
route.get(
  "/getAppointment/:appointmentId",
  verifyToken,
  AppointmentControllerInstance.getAppointment.bind(AppointmentControllerInstance)
);
route.post(
  "/addReview",
  verifyToken,
  AppointmentControllerInstance.addReview.bind(AppointmentControllerInstance)
);
route.get("/doctorReviews/:doctorId", UserControllerInstance.getReviews.bind(UserControllerInstance));
route.put('/cancelAppointment/:appointmentId', verifyToken, BookingControllerInstance.cancelAppointment.bind(BookingControllerInstance));
route.post('/changePassword', verifyToken, UserControllerInstance.changePassword.bind(UserControllerInstance))
route.post("/refresh-token", refreshTokenHandler);

export default route;
