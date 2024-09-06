import { Router } from "express";
import { UserRepositary } from "../repositories/userRepositary";
import UserController from "../controllers/userController";
import { userServices } from "../services/userServices";

const route = Router();

const userRepositary = new UserRepositary();
const userService = new userServices(userRepositary);

//UserService is injected into the userController's instance
const userController = new UserController(userService);

route.post("/signup",userController.register.bind(userController));


export default route;
