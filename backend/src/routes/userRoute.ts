import { Router } from "express";
import { UserRepository } from "../repositories/userRepository";
import UserController from "../controllers/userController";
import { userServices } from "../services/userServices";
import { refreshTokenHandler } from "../config/refreshTokenConfig";
import { AwsConfig } from "../config/awsConfig";
import { verifyToken } from "../config/jwtConfig";

const route = Router();

const userRepositary = new UserRepository();
const S3ServiceInstance = new AwsConfig();
const userService = new userServices(userRepositary, S3ServiceInstance);

//UserService is injected into the userController's instance
const userController = new UserController(userService);

route.post("/signup", userController.register.bind(userController));
route.post("/verifyOtp", userController.verifyOtp.bind(userController));
route.post("/resendOtp", userController.resendOtp.bind(userController));
route.post("/login", userController.verifyLogin.bind(userController));
route.get(
  "/check-status/:email",
  userController.checkStatus.bind(userController)
);
route.post("/logout", userController.logoutUser.bind(userController));
route.get("/getDoctors", userController.getDoctors.bind(userController));
route.get(
  "/specializations",
  userController.getSpecializations.bind(userController)
);
route.get("/getDepDoctors", userController.getDepDoctors.bind(userController));
route.get(
  "/getDoctorData/:doctorId",
  userController.getDoctorData.bind(userController)
);
route.get("/getSlots/:doctorId/:date", userController.getSlots.bind(userController));
route.post("/createAppointment",userController.createAppointment.bind(userController))
route.post("/holdTimeslot",verifyToken,userController.holdSlot.bind(userController))
route.post("/refresh-token", refreshTokenHandler);

export default route;
