'use client'

import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  Home,
  LogOut,
  Calendar,
  DollarSign,
  User,
  Users,

} from "lucide-react";
import { FaCheckToSlot } from "react-icons/fa6";
import myImage from "../../assets/Screenshot_2024-08-15_191834-removebg-preview.png";
import { clearUser } from "../../Redux/Slice/doctorSlice";
import { logoutDoctor } from "../../services/doctorServices";
import { Button } from "../../../components/ui/button";
import { ScrollArea } from "../../../components/ui/scroll-area";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarProvider
} from "../../../components/ui/sidebar";

export function DoctorSidebar() {
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

  const navItems = [
    { to: "/doctor/dashboard", icon: Home, label: "Dashboard" },
    { to: "/doctor/profile", icon: User, label: "Profile" },
    { to: "/doctor/slots", icon: FaCheckToSlot, label: "Slots" },
    { to: "/doctor/appointments", icon: Calendar, label: "Appointments" },
    { to: "/doctor/wallet", icon: DollarSign, label: "Wallet" },
    { to: "/doctor/patients", icon: Users, label: "Patients" },
  ];

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarHeader className="border-b p-4">
          <img src={myImage} alt="Logo" className="object-cover" />
        </SidebarHeader>
        <SidebarContent>
          <ScrollArea className="h-[calc(100vh-8rem)] px-2">
            <nav className="flex flex-col gap-2 py-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-sm font-medium ${isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-primary"
                    }`
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter className="border-t p-4">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}