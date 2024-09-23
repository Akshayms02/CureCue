import { AdminSideBar } from "../AdminComponents/adminSideBar";
import { Outlet } from "react-router-dom";
import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";

function DoctorLayout() {
  return (
    <>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <AdminSideBar />

        <div className="flex-1 flex flex-col">
          {/* Navbar at the top */}
          <nav className="h-20 bg-white flex items-center justify-between px-2">
            <div className="text-black text-lg font-semibold"></div>
            <div className="flex items-center gap-4">
              {/* Profile icon with round background */}
              <button className="text-black rounded-full p-2 mr-7 outline-8">
                <Avatar>
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
              </button>
            </div>
          </nav>

          {/* Main content area for children */}
          <div className="flex-1 p-4 overflow-y-auto">
            {/* This will render the child routes */}
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default DoctorLayout;
