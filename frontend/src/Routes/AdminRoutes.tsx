import { Routes, Route } from "react-router-dom";

import AdminLogin from "../Pages/Admin/adminLogin";
import AdminLayout from "../Components/Common/AdminLayout";
import AdminDashBoard from "../Pages/Admin/adminDashboard";
import AdminUsers from "../Pages/Admin/adminUsers";

import AdminDocSpecialization from "../Pages/Admin/adminDocSpecialization";
import DoctorApplications from "../Components/AdminComponents/doctorApplications";
import DoctorApplicationDetails from "../Components/AdminComponents/doctorApplicationDetails";
import DoctorViewdetails from "../Components/AdminComponents/doctorViewdetails";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/" element={<AdminLayout />}>
        <Route index path="dashboard" element={<AdminDashBoard />} />
        <Route path="users" element={<AdminUsers role={"user"} />}></Route>
        <Route path="doctors" element={<AdminUsers role={"doctor"} />}></Route>
        <Route path="departments" element={<AdminDocSpecialization />} />
        <Route path="applications" element={<DoctorApplications />}></Route>
        <Route path="/:doctorId" element={<DoctorViewdetails />}></Route>
        <Route
          path="viewApplication"
          element={<DoctorApplicationDetails />}
        ></Route>

      </Route>
    </Routes>
  );
}

export default AdminRoutes;
