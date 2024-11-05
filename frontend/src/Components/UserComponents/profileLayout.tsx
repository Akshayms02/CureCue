import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut, User, Shield } from "lucide-react";
import { useDispatch } from "react-redux";
import { clearUser } from "../../Redux/Slice/userSlice";
import { toast } from "sonner";
import { userLogout } from "../../services/userServices";
import { Button } from "../../../components/ui/button";
import { SlCalender } from "react-icons/sl";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../../../components/ui/sheet";

const ProfileLayout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await userLogout()
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

  const NavItem = ({ to, icon, children }: { to: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-2 p-2 rounded-lg transition-colors ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        }`
      }
    >
      {icon}
      <span className="text-sm font-medium">{children}</span>
    </NavLink>
  );

  const SidebarContent = () => (
    <nav className="space-y-2">
      <NavItem to="profile" icon={<User className="h-4 w-4" />}>
        Profile Overview
      </NavItem>
      <NavItem to="appointments" icon={
        <SlCalender className="h-4 w-4" />
      }>
        Appointments
      </NavItem>
      <NavItem to="security" icon={<Shield className="h-4 w-4" />}>
        Security
      </NavItem>
      <Button
        variant="ghost"
        className="w-full justify-start text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar for larger screens */}
      <aside className="hidden md:flex w-64 flex-col bg-card p-4 shadow-lg">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-card-foreground">DashBoard</h2>
        </div>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden absolute top-4 left-4">
            <User className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-card-foreground">Profile</h2>
          </div>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default ProfileLayout;