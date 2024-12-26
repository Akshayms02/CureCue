import axios from "axios";

const URL = "http://localhost:5000";




const doctorAxiosUrl = axios.create({
  baseURL: URL,
  withCredentials: true,
});

doctorAxiosUrl.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("docaccessToken");

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

doctorAxiosUrl.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const doctorInfo = localStorage.getItem("doctorInfo");
      const parsedDoctorInfo = JSON.parse(doctorInfo as string)
      try {
        const response = await axios.post(
          `${URL}/api/doctor/refresh-token`,
          { doctorId: parsedDoctorInfo?.doctorId },
          {
            withCredentials: true,
          }
        );

        const { accessToken } = response.data;

        localStorage.setItem("docaccessToken", accessToken);

        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        return doctorAxiosUrl(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
export default doctorAxiosUrl;
