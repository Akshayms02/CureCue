// import DoctorDashboard from "../../Components/DoctorComponents/DoctorDashBoardComponent";
import { Dashboard } from "../../../components/ui/dashboard-01";
import { Outlet } from "react-router-dom";

function DashBoard() {
  console.log("reached dashbaord");
  return (
    <>
      <Dashboard />
      <Outlet/>
    </>
  );
}

export default DashBoard;
