import { NavLink } from "react-router-dom";
import {
  Home,
  LucideLogOut,
  CalendarIcon,
  DollarSign,
  UserIcon,
  User,
} from "lucide-react";
import myImage from "../../assets/Screenshot_2024-08-15_191834-removebg-preview.png";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { clearUser } from "../../Redux/Slice/doctorSlice";
import { useDispatch } from "react-redux";
import { FaCheckToSlot } from "react-icons/fa6";
import { logoutDoctor } from "../../services/doctorServices";

export function DoctorSideBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      const response = await logoutDoctor()
      localStorage.removeItem("docaccessToken");
      localStorage.removeItem("doctorInfo");
      dispatch(clearUser());
      toast.success("You have been successfully logged out");

      navigate("/doctor/login");
      console.log(response);
    } catch (error: any) {
      console.error("Logout failed", error);
    }
  };
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div
          className="flex h-12 items-center border-b px-4 lg:h-[60px] lg:px-6"
          style={{ marginTop: "12px", marginBottom: "5px" }}
        >
          <img src={myImage} width={300} />
        </div>
        <div className="flex-1 mt-10">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-4">
            <NavLink
              to="/doctor/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-lg font-semibold ${isActive
                  ? "text-primary bg-gray-300"
                  : "text-muted-foreground hover:text-primary hover:bg-accent/50"
                }`
              }
            >
              <Home className="h-6 w-6" />
              Dashboard
            </NavLink>
            <NavLink
              to="/doctor/profile"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-lg font-semibold ${isActive
                  ? "text-primary bg-gray-300"
                  : "text-muted-foreground hover:text-primary hover:bg-accent/50"
                }`
              }
            >
              <User className="h-6 w-6" />
              Profile
            </NavLink>
            <NavLink
              to="/doctor/slots"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-lg font-semibold ${isActive
                  ? "text-primary bg-gray-300"
                  : "text-muted-foreground hover:text-primary hover:bg-accent/50"
                }`
              }
            >
              <FaCheckToSlot className="h-6 w-6" />
              Slots
            </NavLink>
            <NavLink
              to="/doctor/appointments"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-lg font-semibold ${isActive
                  ? "text-primary bg-gray-300"
                  : "text-muted-foreground hover:text-primary hover:bg-accent/50"
                }`
              }
            >
              <CalendarIcon className="h-6 w-6" />
              Appointments
            </NavLink>
            <NavLink
              to="/doctor/wallet"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-lg font-semibold ${isActive
                  ? "text-primary bg-gray-300"
                  : "text-muted-foreground hover:text-primary hover:bg-accent/50"
                }`
              }
            >
              <DollarSign className="h-6 w-6" />
              Wallet
            </NavLink>
            <NavLink
              to="/doctor/patients"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-lg font-semibold ${isActive
                  ? "text-primary bg-gray-300"
                  : "text-muted-foreground hover:text-primary hover:bg-accent/50"
                }`
              }
            >
              <UserIcon className="h-6 w-6" />
              Patients
            </NavLink>


            <button
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-lg font-semibold text-muted-foreground hover:text-primary hover:bg-accent/50"
            >
              <LucideLogOut className="h-6 w-6" />
              Logout
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
