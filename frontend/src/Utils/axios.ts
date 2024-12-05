import axios from "axios";
import { toast } from "sonner";


const URL = "http://localhost:5000";


const storedUserInfo = localStorage.getItem('userInfo');
let userInfo: any
let userId: any
if (storedUserInfo) {
  userInfo = JSON.parse(storedUserInfo);
  userId = userInfo.userId;
}

const axiosUrl = axios.create({
  baseURL: URL,
  withCredentials: true,
  headers: userId ? { 'userId': userId } : {},
});



axiosUrl.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");


    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosUrl.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {

    // const dispatch = useDispatch();
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 403 &&
      error.response.data === 'User Blocked'
    ) {
      // Show toast message for blocked user
      toast.error("User is blocked");

      // Redirect to login page

      window.location.href = "/login";

      return Promise.reject(error);
    }

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const userInfo = localStorage.getItem("userInfo");
      const parsedUserInfo = JSON.parse(userInfo as string)
      try {
        const response = await axios.post(
          `${URL}/api/user/refresh-token`,
          { userId: parsedUserInfo?.userId },
          {
            withCredentials: true,
          }
        );

        const { accessToken } = response.data;

        localStorage.setItem("accessToken", accessToken);

        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        return axiosUrl(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
export default axiosUrl;
