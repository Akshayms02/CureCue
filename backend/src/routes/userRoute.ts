import { Router } from "express";
import { UserRepository } from "../repositories/userRepository";
import UserController from "../controllers/userController";
import { userServices } from "../services/userServices";
import { refreshTokenHandler } from "../config/refreshTokenConfig";
import { AwsConfig } from "../config/awsConfig";

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
route.get("/getDoctors",userController.getDoctors.bind(userController))
route.post("/refresh-token", refreshTokenHandler);

export default route;
