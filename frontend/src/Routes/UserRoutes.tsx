import { Routes, Route } from "react-router-dom";
import UserSignup from "../Pages/User/userSignup";
// import Otp from "../pages/userPages/OtpPage";
import Login from "../Pages/User/userLogin";

function UserRoutes() {
  console.log("fjfghj");
  return (
    <Routes>
      <Route path="/signup" element={<UserSignup/>}></Route>
      {/* <Route path="/otp" element={<Otp />} /> */ }
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default UserRoutes;
