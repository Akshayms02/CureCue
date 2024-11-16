import { RootState } from "../../Redux/store";
import { useSelector } from "react-redux";
import { DoctorKycComponent } from "../../Components/DoctorComponents/DoctorKycComponent";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearUser, setDocStatus } from "../../Redux/Slice/doctorSlice";
import axiosUrl from "../../Utils/axios";
import { VerificationPending } from "../../Components/DoctorComponents/VerficationPending";
import doctorAxiosUrl from "../../Utils/doctorAxios";

interface DoctorProtectedRouteProps {
  children: React.ReactNode;
}

function DoctorProtectedRoute({ children }: DoctorProtectedRouteProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const DoctorData = useSelector((state: RootState) => state.doctor);

  useEffect(() => {
    const checkDoctorStatus = async () => {
      try {
        if (DoctorData.doctorInfo) {
          const email = DoctorData?.doctorInfo?.email;
          const { data } = await doctorAxiosUrl.get(
            `/api/doctor/check-status/${email}`
          );

          if (data.isBlocked === true) {
            await doctorAxiosUrl.post("/api/doctor/logout");
            dispatch(clearUser());
            localStorage.removeItem("doctorInfo");
            localStorage.removeItem("docaccessToken")
            navigate("/doctor/login");
          }
          dispatch(setDocStatus({ kycStatus: data.kycStatus }));
        } else {
          navigate("/doctor/login");
        }
      } catch (error: any) {
        console.error("Error checking doctor status:", error);
        navigate("/doctor/login");
      }
    };
    checkDoctorStatus();
  }, [navigate, DoctorData.doctorInfo, dispatch]);
  console.log("DoctorData:", DoctorData);
  if (DoctorData.docStatus === "submitted") {
    return <VerificationPending />;
  } else if (DoctorData.docStatus === "rejected") {
    // const reason = "No reason provided"; //DoctorData.doctorInfo?.rejectedReason || (Need to put this here)

    return <DoctorKycComponent />;
  } else if (DoctorData.docStatus === "pending") {
    return <DoctorKycComponent />;
  } else {
    return <>{children}</>;
  }
}

export default DoctorProtectedRoute;
