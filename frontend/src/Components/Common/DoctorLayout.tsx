import { DoctorSidebar } from "../DoctorComponents/doctorSidebar";
import { Outlet } from "react-router-dom";

function DoctorLayout() {
  return (
    <>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <DoctorSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default DoctorLayout;
