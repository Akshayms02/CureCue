import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosUrl from "../../Utils/axios";

const API = "/api/doctor";

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
        localStorage.setItem("userEmail", credentials.email);
        return true;
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

export const resendOtp = createAsyncThunk<boolean>(
  "user/resendOtp",
  async (_, { rejectWithValue }) => {
    try {
      const email = localStorage.getItem("userEmail");
      if (!email) throw new Error("No email found in localStorage");

      const response = await axiosUrl.post(`${API}/resendOtp`, { email });
      return response.status === 200;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error happened in resendOtp: ${error.message}`);
      } else {
        return rejectWithValue("Failed to resend OTP");
      }
    }
  }
);

export const login = createAsyncThunk(
  "doctor/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      console.log("hello from doctorlogin");
      const response = await axiosUrl.post(`${API}/login`, credentials);
      console.log("sfsfs",response);
      const { docaccessToken, doctorInfo } = response.data.Credentials;

      return { docaccessToken, doctorInfo };
    } catch (error: any) {
      console.log("eee",error.response.data.message);
      return rejectWithValue(error.response.data.message||"Login failed");
    }
  }
);
