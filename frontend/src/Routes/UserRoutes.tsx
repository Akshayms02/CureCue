import { Routes, Route } from "react-router-dom";
import UserSignup from "../Pages/User/userSignup";
import UserOtpPage from "../Pages/User/UserOtpPage";
import Login from "../Pages/User/userLogin";

function UserRoutes() {
  return (
    <Routes>
      <Route path="/signup" element={<UserSignup />}/>
      <Route path="/otp" element={<UserOtpPage />}/>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default UserRoutes;
