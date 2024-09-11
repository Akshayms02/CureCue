import { Routes, Route } from "react-router-dom";
import DoctorSignup from "../Pages/Doctor/DoctorSignup";
import DoctorOtpPage from "../Pages/Doctor/DoctorOtp";
import DoctorLogin from "../Pages/Doctor/DoctorLogin";
import DashBoard from "../Pages/Doctor/DashBoard";

function DoctorRoutes() {
  return (
    <Routes>
      <Route path="/dashBoard" element={<DashBoard />} />
      <Route path="/signup" element={<DoctorSignup />} />
      <Route path="/otp" element={<DoctorOtpPage />} />
      <Route path="/login" element={<DoctorLogin />} />
    </Routes>
  );
}

export default DoctorRoutes;
