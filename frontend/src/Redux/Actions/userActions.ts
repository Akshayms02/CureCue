import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosUrl from "../../Utils/axios";

const API = "/api/user";

export const signUp = (credentials: {
  name: string;
  email: string;
  password: string;
  phone: string;
  confirmPassword: string;
}) => {
  return async () => {
    try {
      const response = await axiosUrl.post(`${API}/signup`, credentials);
      console.log(response);
      if (response.data === true) {
        console.log();
        localStorage.setItem("userEmail", credentials.email);
      }
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        throw error;
      }
    }
  };
};

export const verifyOtp = (otp: string) => {
  return async () => {
    try {
      console.log("hello from verifyotp handler");
      const email = localStorage.getItem("userEmail");
      const response = await axiosUrl.post(`${API}/verifyOtp`, { email, otp });
      if (response.data.message == "verified") {
        localStorage.clear();
        return { status: true };
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === "Wrong OTP") {
          throw new Error("Wrong");
        } else if (error.message === "OTP Expired") {
          throw new Error("Expired");
        }
      } else {
        throw new Error("Unknow error occured");
      }
    }
  };
};

export const resendOtp = () => {
  return async () => {
    try {
      const token = localStorage.getItem("userOtp");

      const response = await axiosUrl.post(
        "/resendOtp",
        {},
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status) {
        localStorage.removeItem("userOtp");
        const tokenNew = response.data.response.token;
        console.log("newtoken", tokenNew);

        localStorage.setItem("userOtp", tokenNew);
        return { status: true };
      }
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Unknown error has occured");
      }
    }
  };
};

export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosUrl.post(`${API}/login`, credentials);
      console.log(response);
      return response;
    } catch (error: unknown) {
      console.log(error);
      return rejectWithValue("Login failed");
    }
  }
);
