import { Routes, Route } from "react-router-dom";
import UserSignup from "../Pages/User/userSignup";
import UserOtp from "../Pages/User/userOtp";
import Login from "../Pages/User/userLogin";

import ProfileLayout from "../Components/UserComponents/profileLayout";
import ProfileOverview from "../Components/UserComponents/profileOverview";
import UserProtectedRoute from "./ProtectedRoutes/UserProtectedRoute";
import UserLayout from "../Components/Common/userLayout";
import UserHome from "../Components/UserComponents/UserHome";
import UserBookingPage from "../Components/UserComponents/UserBookingPage";
import DoctorListDepartmentWise from "../Components/UserComponents/DoctorListDepartmentWise";
import Doctordetails from "../Components/UserComponents/Doctordetails";
import UserAppointmentsList from "../Components/UserComponents/UserAppointments";
import UserAppointmentDetails from "../Components/UserComponents/UserAppointmentDetails";
import UserChatUI from "../Components/UserComponents/UserChatUI";

function UserRoutes() {
  return (
    <Routes>
      <Route path="/signup" element={<UserSignup />} />
      <Route path="/otp" element={<UserOtp />} />
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<UserLayout />}>
        <Route path="/" element={<UserHome />}></Route>
        <Route path="/booking" element={<UserBookingPage />}></Route>
        <Route path="/:departmentId" element={<DoctorListDepartmentWise />}></Route>
        <Route path="/doctordetails/:doctorId" element={<Doctordetails />}></Route>
      </Route>

      <Route path="/" element={<ProfileLayout />}>
        <Route
          path="profile"
          element={
            <UserProtectedRoute>
              <ProfileOverview />
            </UserProtectedRoute>
          }
        />

        <Route
          path="appointments"
          element={
            <UserProtectedRoute>
              <UserAppointmentsList />
            </UserProtectedRoute>
          }
        />
        <Route
          path="viewAppointment"
          element={
            <UserProtectedRoute>
              <UserAppointmentDetails />
            </UserProtectedRoute>
          }
        />
        <Route
          path="chat"
          element={
            <UserProtectedRoute>
              <UserChatUI />
            </UserProtectedRoute>
          }
        />

        {/* <Route path="settings" element={<ProfileSettings />} />
          <Route path="security" element={<ProfileSecurity />} /> */}
      </Route>

    </Routes>
  );
}

export default UserRoutes;
