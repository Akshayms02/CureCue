import { NavLink } from "react-router-dom";
import {
  Home,
  LucideLogOut,
  CalendarIcon,
  ClipboardListIcon,
  UserIcon,
} from "lucide-react";
import myImage from "../../assets/Screenshot_2024-08-15_191834-removebg-preview.png";

export function DoctorSideBar() {
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
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-lg font-semibold ${
                  isActive
                    ? "text-primary bg-gray-300"
                    : "text-muted-foreground hover:text-primary hover:bg-accent/50"
                }`
              }
            >
              <Home className="h-6 w-6" />
              Dashboard
            </NavLink>
            <NavLink
              to="/doctor/appointments"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-lg font-semibold ${
                  isActive
                    ? "text-primary bg-gray-300"
                    : "text-muted-foreground hover:text-primary hover:bg-accent/50"
                }`
              }
            >
              <CalendarIcon className="h-6 w-6" />
              Appointments
            </NavLink>
            <NavLink
              to="/doctor/patients"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-lg font-semibold ${
                  isActive
                    ? "text-primary bg-gray-300"
                    : "text-muted-foreground hover:text-primary hover:bg-accent/50"
                }`
              }
            >
              <UserIcon className="h-6 w-6" />
              Patients
            </NavLink>
            <NavLink
              to="/doctor/reports"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-lg font-semibold ${
                  isActive
                    ? "text-primary bg-gray-300"
                    : "text-muted-foreground hover:text-primary hover:bg-accent/50"
                }`
              }
            >
              <ClipboardListIcon className="h-6 w-6" />
              Reports
            </NavLink>
            <NavLink
              to="/doctor/logout"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-lg font-semibold ${
                  isActive
                    ? "text-primary bg-gray-300"
                    : "text-muted-foreground hover:text-primary hover:bg-accent/50"
                }`
              }
            >
              <LucideLogOut className="h-6 w-6" />
              Logout
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  );
}
