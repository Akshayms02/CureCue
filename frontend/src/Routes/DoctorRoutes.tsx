import { Routes, Route } from "react-router-dom";
import DoctorSignup from "../Pages/Doctor/DoctorSignup";
import DoctorOtpPage from "../Pages/Doctor/DoctorOtp";
import DoctorLogin from "../Pages/Doctor/DoctorLogin";

import DoctorLayout from "../Components/Common/DoctorLayout";
import  DoctorDashboard  from "../Components/DoctorComponents/DoctorDashBoardComponent";
import DoctorProtectedRoute from "./ProtectedRoutes/DoctorProtectedRoute";
import ProfileCard from "../Pages/Doctor/Profile";
import SlotManagement from "../Pages/Doctor/SlotManagement";
import DoctorWallet from "../Components/DoctorComponents/DoctorWallet";
import AppointmentList from "../Components/DoctorComponents/AppointmentList";
import AppointmentDetails from "../Components/DoctorComponents/AppointmentDetail";
import DoctorChatUI from "../Components/DoctorComponents/DoctorChatUI";
// import DoctorScheduler from "../Pages/Doctor/slot";

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
        <Route
          path="slots"
          element={
            <DoctorProtectedRoute>
              <SlotManagement />
            </DoctorProtectedRoute>
          }
        ></Route>
        <Route
          path="appointments"
          element={
            <DoctorProtectedRoute>
              <AppointmentList />
            </DoctorProtectedRoute>
          }
        ></Route>
        <Route
          path="appointmentDetails"
          element={
            <DoctorProtectedRoute>
              <AppointmentDetails />
            </DoctorProtectedRoute>
          }
        ></Route>
        <Route
          path="wallet"
          element={
            <DoctorProtectedRoute>
              <DoctorWallet/>
            </DoctorProtectedRoute>
          }
        ></Route>
        <Route
          path="chat"
          element={
            <DoctorProtectedRoute>
              <DoctorChatUI/>
            </DoctorProtectedRoute>
          }
        ></Route>
      </Route>
    </Routes>
  );
}

export default DoctorRoutes;
