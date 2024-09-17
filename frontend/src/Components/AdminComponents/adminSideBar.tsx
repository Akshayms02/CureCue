import { NavLink } from "react-router-dom";
import {
  Home,
  LucideLogOut,
  Users2Icon,
  BriefcaseMedicalIcon,
  MedalIcon,
} from "lucide-react";
import myImage from "../../assets/Screenshot_2024-08-15_191834-removebg-preview.png";

export function AdminSideBar() {
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
              to="/admin/dashboard"
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
              to="/admin/users"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-lg font-semibold ${
                  isActive
                    ? "text-primary bg-gray-300"
                    : "text-muted-foreground hover:text-primary hover:bg-accent/50"
                }`
              }
            >
              <Users2Icon className="h-6 w-6" />
              Users
            </NavLink>
            <NavLink
              to="/admin/departments"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-lg font-semibold ${
                  isActive
                    ? "text-primary bg-gray-300"
                    : "text-muted-foreground hover:text-primary hover:bg-accent/50"
                }`
              }
            >
              <MedalIcon className="h-6 w-6" />
              Departments{" "}
            </NavLink>
            <NavLink
              to="/admin/doctors"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-lg font-semibold ${
                  isActive
                    ? "text-primary bg-gray-300"
                    : "text-muted-foreground hover:text-primary hover:bg-accent/50"
                }`
              }
            >
              <BriefcaseMedicalIcon className="h-6 w-6" />
              Doctors
            </NavLink>
            <NavLink
              to="/admin/logout"
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
