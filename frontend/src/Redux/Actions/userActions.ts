import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosUrl from "../../Utils/axios";

const API = "/api/user";

export const signUp =(credentials: {
  name: string;
  email: string;
  password: string;
  phone: string;
  confirmPassword: string;
})=> async () => {
  try {
    const response = await axiosUrl.post(`${API}/signup`, credentials);
    console.log(response);
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      throw error;
    }
  }
};

export const verifyOtp = (otp: string) => {
  return async () => {
    try {
      const email = localStorage.getItem("userEmail");
      const response = await axiosUrl.post(`${API}/verifyOtp`, { email, otp });
      if (response.data.message == "verified") {
        localStorage.clear();
        return true;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === "Wrong OTP") {
          return "Wrong";
        } else if (error.message === "OTP Expired") {
          return "Expired";
        }
      } else {
        throw "Unknow error occured";
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
