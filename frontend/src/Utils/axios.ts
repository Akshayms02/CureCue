import axios from "axios";

const axiosUrl = axios.create({
  baseURL: "http://localhost:5000",
});

export default axiosUrl;
