import DoctorDashboard from "../../Components/DoctorComponents/DoctorDashBoardComponent";

import { Outlet } from "react-router-dom";

function DashBoard() {
  console.log("reached dashbaord");
  return (
    <>
      <DoctorDashboard />
      <Outlet />
    </>
  );
}

export default DashBoard;
