
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Home,
  LogOut,
  Users2,
  Briefcase,
  Medal,
  CalendarClock,
} from "lucide-react";
import myImage from "../../assets/Screenshot_2024-08-15_191834-removebg-preview.png";
import { adminLogout } from "../../services/adminServices";
import { Button } from "../../../components/ui/button";
import { ScrollArea } from "../../../components/ui/scroll-area";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarProvider,
} from "../../../components/ui/sidebar";

export function AdminSideBar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await adminLogout();
      console.log(response);
      localStorage.removeItem("adminAccessToken");
      localStorage.removeItem("adminInfo");
      toast.success("You have been successfully logged out");
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const navItems = [
    { to: "/admin/dashboard", icon: Home, label: "Dashboard" },
    { to: "/admin/users", icon: Users2, label: "Users" },
    { to: "/admin/departments", icon: Medal, label: "Departments" },
    { to: "/admin/doctors", icon: Briefcase, label: "Doctors" },
    { to: "/admin/applications", icon: CalendarClock, label: "Applications" },
  ];

  return (
    <SidebarProvider>
      <Sidebar className="border-r shadow-2xl">
        {/* Sidebar Header */}
        <SidebarHeader className="border-b p-4">
          <img src={myImage} alt="Logo" className="object-cover" />
        </SidebarHeader>

        {/* Sidebar Content */}
        <SidebarContent>
          <ScrollArea className="h-[calc(100vh-8rem)] px-2">
            <nav className="flex flex-col gap-2 py-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-sm font-medium ${
                      isActive
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

        {/* Sidebar Footer */}
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
