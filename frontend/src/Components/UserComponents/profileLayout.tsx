import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { clearUser } from "../../Redux/Slice/userSlice";
import axiosUrl from "../../Utils/axios";
import { toast } from "sonner";

const ProfileLayout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await axiosUrl.post("/api/user/logout", {
        headers: {
          "Token-Type": "user",
        },
      });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userInfo");
      dispatch(clearUser());
      toast.success("You have been successfully logged out");

      navigate("/login");
      console.log(response);
    } catch (error: any) {
      console.error("Logout failed", error);
    }
  };
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <nav className="w-1/5 bg-gradient-to-r from-stone-500 to-stone-700 text-white p-2 flex flex-col items-center space-y-4 rounded-3xl mt-5 ml-3 mb-5">
        <ul className="space-y-10 mt-12">
          <li className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <NavLink to="profile" className="hover:underline text-xl">
              Profile Overview
            </NavLink>
          </li>
          <li className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10.325 4.317c-4.892 0-8.773 3.881-8.773 8.773s3.881 8.773 8.773 8.773c4.892 0 8.773-3.881 8.773-8.773S15.217 4.317 10.325 4.317zm0 13.243a4 4 0 100-8 4 4 0 000 8zm0-8a2 2 0 100 4 2 2 0 000-4z"
              />
            </svg>
            <NavLink to="settings" className="hover:underline text-xl">
              Profile Settings
            </NavLink>
          </li>
          <li className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v11a2 2 0 002 2zm0-1a1 1 0 00-1 1v-1a1 1 0 001-1zm0 0a1 1 0 001 1v1a1 1 0 001 1h3a1 1 0 001-1v-1a1 1 0 00-1-1h-3z"
              />
            </svg>
            <NavLink to="security" className="hover:underline text-xl">
              Security
            </NavLink>
          </li>
          <li className="flex items-center space-x-2">
            <LogOut />
            <button onClick={handleLogout} className="hover:underline text-xl">
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="w-full p-8 bg-white">
        <Outlet /> {/* This renders the nested route content */}
      </div>
    </div>
  );
};

export default ProfileLayout;
