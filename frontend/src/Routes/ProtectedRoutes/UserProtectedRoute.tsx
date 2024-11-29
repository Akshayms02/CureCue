import { RootState } from "../../Redux/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearUser } from "../../Redux/Slice/userSlice";
import axiosUrl from "../../Utils/axios";

interface UserProtectedRouteProps {
  children: React.ReactNode;
}

function UserProtectedRoute({ children }: UserProtectedRouteProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.user); 

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        if (userData.userInfo) {
          const email = userData?.userInfo?.email;
          const { data } = await axiosUrl.get(
            `/api/user/check-status/${email}`
          );

          if (data.isBlocked === true) {
            await axiosUrl.post("/api/user/logout");
            dispatch(clearUser());
            localStorage.removeItem("userInfo");
            localStorage.removeItem("accessToken");
            navigate("/login");
          }
        } else {
          navigate("/login");
        }
      } catch (error: any) {
        console.error("Error checking user status:", error);
        navigate("/login");
      }
    };

    checkUserStatus();
  }, [navigate, userData.userInfo, dispatch]);

  if (!userData.userInfo) {
    return <p>Loading...</p>;
  } else {
    return <>{children}</>;
  }
}

export default UserProtectedRoute;
