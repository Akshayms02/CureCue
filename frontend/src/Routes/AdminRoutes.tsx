import { Routes, Route } from "react-router-dom";

import AdminLogin from "../Pages/Admin/adminLogin";
import AdminLayout from "../Components/Common/AdminLayout";
import AdminDashBoard from "../Pages/Admin/adminDashboard";
import AdminUsers from "../Pages/Admin/adminUsers";
import AdminDoctors from "../Pages/Admin/adminDoctors";
import AdminDocSpecialization from "../Pages/Admin/adminDocSpecialization";
import DoctorApplications from "../Components/AdminComponents/doctorApplications";
import DoctorApplicationDetails from "../Components/AdminComponents/doctorApplicationDetails";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/" element={<AdminLayout />}>
        <Route index path="dashboard" element={<AdminDashBoard />} />
        <Route path="users" element={<AdminUsers />}></Route>
        <Route path="doctors" element={<AdminDoctors />}></Route>
        <Route path="departments" element={<AdminDocSpecialization />} />
        <Route path="applications" element={<DoctorApplications/>}></Route>
        <Route path="viewApplication" element={<DoctorApplicationDetails/>}></Route>
        {/*<Route path="viewApplication" element={<ApplicationDetailspage />} /> */}
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
