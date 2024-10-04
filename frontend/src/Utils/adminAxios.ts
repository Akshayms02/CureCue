import axios from "axios";

const URL = "http://localhost:5000";

const adminAxiosUrl = axios.create({
  baseURL: URL,
  withCredentials: true,
});

adminAxiosUrl.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("adminAccessToken");

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

adminAxiosUrl.interceptors.response.use(
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

      try {
        const response = await axios.post(
          `${URL}/api/doctor/refresh-token`,
          {},
          {
            withCredentials: true,
          }
        );

        const { accessToken } = response.data;

        localStorage.setItem("adminAccessToken", accessToken);

        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        return adminAxiosUrl(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
export default adminAxiosUrl;
