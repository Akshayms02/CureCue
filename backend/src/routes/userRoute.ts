import { Router } from "express";
import { UserRepositary } from "../repositories/userRepositary";
import UserController from "../controllers/userController";
import { userServices } from "../services/userServices";
import { refreshTokenHandler } from "../config/refreshTokenConfig";

const route = Router();

const userRepositary = new UserRepositary();
const userService = new userServices(userRepositary);

//UserService is injected into the userController's instance
const userController = new UserController(userService);

route.post("/signup", userController.register.bind(userController));
route.post("/verifyOtp", userController.verifyOtp.bind(userController));
route.post("/resendOtp", userController.resendOtp.bind(userController));
route.post("/login", userController.verifyLogin.bind(userController));
route.post('/refresh-token', refreshTokenHandler);

export default route;
