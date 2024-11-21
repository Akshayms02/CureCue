import { Router } from "express";
import AdminController from "../controllers/adminController";
import { AdminRepository } from "../repositories/adminRepository";
import { adminServices } from "../services/adminServices";
import { AwsConfig } from "../config/awsConfig";
import { verifyAdminToken } from "../config/jwtConfig";

const route = Router();
const adminRepository = new AdminRepository();
const S3ServiceInstance = new AwsConfig();
const adminService = new adminServices(adminRepository, S3ServiceInstance);
const adminController = new AdminController(adminService);

route.post("/login", adminController.loginAdmin.bind(adminController));
route.post(
  "/addSpecialization",
  verifyAdminToken,
  adminController.addSpecialization.bind(adminController)
);
route.post("/logout", adminController.adminLogout.bind(adminController));
route.get(
  "/getSpecializations",
  verifyAdminToken,
  adminController.getSpecialization.bind(adminController)
);
route.put(
  "/updateSpecialization",
  verifyAdminToken,
  adminController.editSpecialization.bind(adminController)
);
route.put(
  "/listUnlistSpecialization",
  verifyAdminToken,
  adminController.listUnlistSpecialization.bind(adminController)
);
route.get(
  "/getUsers",
  verifyAdminToken,
  adminController.getUsers.bind(adminController)
);
route.put(
  "/listUnlistUser/:userId",
  verifyAdminToken,
  adminController.listUnlistUser.bind(adminController)
);
route.get(
  "/getDoctors",
  verifyAdminToken,
  adminController.getDoctors.bind(adminController)
);
route.put(
  "/listUnlistDoctor/:doctorId",
  verifyAdminToken,
  adminController.listUnlistDoctor.bind(adminController)
);

route.get(
  "/getApplications",
  verifyAdminToken,
  adminController.getAllApplications.bind(adminController)
);

route.get(
  "/doctorApplication/:id",
  verifyAdminToken,
  adminController.getDoctorApplication.bind(adminController)
);

route.post(
  "/accept-doctor/:doctorId",
  verifyAdminToken,
  adminController.acceptApplication.bind(adminController)
);

route.get(
  "/getDoctor",
  verifyAdminToken,
  adminController.getDoctorData.bind(adminController)
);

route.get(
  "/dashboardData",
  verifyAdminToken,
  adminController.getDashboardData.bind(adminController)
);

export default route;
