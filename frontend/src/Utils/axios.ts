import axios from "axios";

const URL = "http://localhost:5000";

const axiosUrl = axios.create({
  baseURL: URL,
  withCredentials: true,
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
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${URL}/api/user/refresh-token`,
          {},
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
