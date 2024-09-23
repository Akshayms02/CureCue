import { Routes, Route } from "react-router-dom";
import UserSignup from "../Pages/User/userSignup";
import UserOtp from "../Pages/User/userOtp";
import Login from "../Pages/User/userLogin";
import LandingPage from "../Pages/User/LandingPage";
import ProfileLayout from "../Components/UserComponents/profileLayout";
import ProfileOverview from "../Components/UserComponents/profileOverview";

function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />}></Route>
      <Route path="/signup" element={<UserSignup />} />
      <Route path="/otp" element={<UserOtp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<ProfileLayout />}>
          <Route path="overview" element={<ProfileOverview />} />
          {/* <Route path="settings" element={<ProfileSettings />} />
          <Route path="security" element={<ProfileSecurity />} /> */}
        </Route>
    </Routes>
  );
}

export default UserRoutes;
