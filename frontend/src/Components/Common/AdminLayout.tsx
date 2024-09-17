import { AdminSideBar } from "../AdminComponents/adminSideBar";
import { Outlet } from "react-router-dom";

function DoctorLayout() {
  return (
    <>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <AdminSideBar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default DoctorLayout;
