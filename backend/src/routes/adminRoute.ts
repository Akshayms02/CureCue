import { Router } from "express";
import AdminController from "../controllers/adminController";
import { AdminRepository } from "../repositories/adminRepository";
import { adminServices } from "../services/adminServices";
import { AwsConfig } from "../config/awsConfig";

const route = Router();
const adminRepository = new AdminRepository();
const S3ServiceInstance = new AwsConfig();
const adminService = new adminServices(adminRepository, S3ServiceInstance);
const adminController = new AdminController(adminService);

route.post("/login", adminController.loginAdmin.bind(adminController));
route.post(
  "/addSpecialization",
  adminController.addSpecialization.bind(adminController)
);
route.post("/logout", adminController.adminLogout.bind(adminController));
route.get(
  "/getSpecializations",
  adminController.getSpecialization.bind(adminController)
);
route.put(
  "/updateSpecialization",
  adminController.editSpecialization.bind(adminController)
);
route.put(
  "/listUnlistSpecialization",
  adminController.listUnlistSpecialization.bind(adminController)
);
route.get("/getUsers", adminController.getUsers.bind(adminController));
route.put(
  "/listUnlistUser/:userId",
  adminController.listUnlistUser.bind(adminController)
);
route.get("/getDoctors", adminController.getDoctors.bind(adminController));
route.put(
  "/listUnlistDoctor/:doctorId",
  adminController.listUnlistDoctor.bind(adminController)
);

route.get(
  "/getApplications",
  adminController.getAllApplications.bind(adminController)
);

route.get(
  "/doctorApplication/:id",
  adminController.getDoctorApplication.bind(adminController)
);

route.post(
  "/accept-doctor/:doctorId",
  adminController.acceptApplication.bind(adminController)
);

route.get("/getDoctor",adminController.getDoctorData.bind(adminController))

export default route;
