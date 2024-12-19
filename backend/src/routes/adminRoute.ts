import { Router } from "express";
import { AdminRepository } from "../repositories/admin/Admin";
import { AwsConfig } from "../config/awsConfig";
import { AdminService } from "../services/admin/Admin";
import { AdminController } from "../controllers/admin/Admin";

import { verifyAdminToken } from "../config/jwtConfig";
import { AuthRepository } from "../repositories/admin/Auth";
import { AuthService } from "../services/admin/Auth";
import { AuthController } from "../controllers/admin/Auth";

const route = Router();
const AdminRepositoryInstance = new AdminRepository();
const S3ServiceInstance = new AwsConfig();
const AdminServiceInstance = new AdminService(AdminRepositoryInstance, S3ServiceInstance);
const AdminControllerInstance = new AdminController(AdminServiceInstance)

const AuthRepositoyInstance = new AuthRepository();
const AuthServiceInstance = new AuthService(AuthRepositoyInstance);
const AuthControllerInstance = new AuthController(AuthServiceInstance)

route.post("/login", AuthControllerInstance.loginAdmin.bind(AuthControllerInstance));
route.post(
  "/addSpecialization",
  verifyAdminToken,
  AdminControllerInstance.addSpecialization.bind(AdminControllerInstance)
);
route.post("/logout", AuthControllerInstance.adminLogout.bind(AuthControllerInstance));
route.get(
  "/getSpecializations",
  verifyAdminToken,
  AdminControllerInstance.getSpecialization.bind(AdminControllerInstance)
);
route.put(
  "/updateSpecialization",
  verifyAdminToken,
  AdminControllerInstance.editSpecialization.bind(AdminControllerInstance)
);
route.put(
  "/listUnlistSpecialization",
  verifyAdminToken,
  AdminControllerInstance.listUnlistSpecialization.bind(AdminControllerInstance)
);
route.get(
  "/getUsers",
  verifyAdminToken,
  AdminControllerInstance.getUsers.bind(AdminControllerInstance)
);
route.put(
  "/listUnlistUser/:userId",
  verifyAdminToken,
  AdminControllerInstance.listUnlistUser.bind(AdminControllerInstance)
);
route.get(
  "/getDoctors",
  verifyAdminToken,
  AdminControllerInstance.getDoctors.bind(AdminControllerInstance)
);
route.put(
  "/listUnlistDoctor/:doctorId",
  verifyAdminToken,
  AdminControllerInstance.listUnlistDoctor.bind(AdminControllerInstance)
);

route.get(
  "/getApplications",
  verifyAdminToken,
  AdminControllerInstance.getAllApplications.bind(AdminControllerInstance)
);

route.get(
  "/doctorApplication/:id",
  verifyAdminToken,
  AdminControllerInstance.getDoctorApplication.bind(AdminControllerInstance)
);

route.post(
  "/accept-doctor/:doctorId",
  verifyAdminToken,
  AdminControllerInstance.acceptApplication.bind(AdminControllerInstance)
);

route.get(
  "/getDoctor",
  AdminControllerInstance.getDoctorData.bind(AdminControllerInstance)
);

route.get(
  "/dashboardData",
  verifyAdminToken,
  AdminControllerInstance.getDashboardData.bind(AdminControllerInstance)
);

export default route;
