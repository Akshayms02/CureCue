import { Routes, Route } from "react-router-dom";
import DoctorSignup from "../Pages/Doctor/DoctorSignup";
import DoctorOtpPage from "../Pages/Doctor/DoctorOtp";
import DoctorLogin from "../Pages/Doctor/DoctorLogin";

import DoctorLayout from "../Components/Common/DoctorLayout";
import { DoctorDashboard } from "../Components/DoctorComponents/DoctorDashBoardComponent";
import DoctorProtectedRoute from "./ProtectedRoutes/DoctorProtectedRoute";
import ProfileCard from "../Pages/Doctor/Profile";

function DoctorRoutes() {
  return (
    <Routes>
      <Route path="/signup" element={<DoctorSignup />} />
      <Route path="/otp" element={<DoctorOtpPage />} />
      <Route path="/login" element={<DoctorLogin />} />
      <Route path="/" element={<DoctorLayout />}>
        <Route
          index
          path="dashboard"
          element={
            <DoctorProtectedRoute>
              <DoctorDashboard />
            </DoctorProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <DoctorProtectedRoute>
              <ProfileCard />
            </DoctorProtectedRoute>
          }
        ></Route>
      </Route>
    </Routes>
  );
}

export default DoctorRoutes;
