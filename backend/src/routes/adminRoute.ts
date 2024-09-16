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
route.get(
  "/getApplications",
  adminController.getApplication.bind(adminController)
);
route.get(
  "/getDoctorApplication/:applicationId",
  adminController.getDoctorApplication.bind(adminController)
);
route.post(
  "/approveApplication/:doctorId",
  adminController.approveApplication.bind(adminController)
);
route.delete(
  "/rejectApplication/:doctorId",
  adminController.rejectApplication.bind(adminController)
);

export default route;
