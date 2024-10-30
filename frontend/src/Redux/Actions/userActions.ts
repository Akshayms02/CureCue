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
        console.log("here");
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
        if (error.message == "No email found in localStorage") {
          throw new Error("Invalid Entry");
        }
        throw new Error(`${error.message}`);
      } else {
        return rejectWithValue("Failed to resend OTP");
      }
    }
  }
);

export const login = createAsyncThunk(
  "user/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      console.log("hello from login");
      const response = await axiosUrl.post(`${API}/login`, credentials);
      console.log(response);
      const { accessToken, userInfo } = response.data.Credentials;

      return { accessToken, userInfo };
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.response.data.message || "Login failed");
    }
  }
);
export const updateUserProfile = createAsyncThunk(
  "doctor/updatUserProfile",
  async ({ userId, gender, DOB, phone,email,name }: any, { rejectWithValue }) => {
    try {
      const response = await axiosUrl.put("/api/user/updateUser", {
        userId: userId,
        gender,
        DOB,
        phone,
        email,
        name
      });

      console.log("Thunkkkk response:", response.data.response);
      return response.data.response;
    } catch (error: any) {
      if (error.response) {
        const errorMessage = error.response.data.message || "Update failed";
        console.log("Error response:", errorMessage);
        return rejectWithValue(errorMessage);
      } else if (error.request) {
        return rejectWithValue("No response from server.");
      } else {
        return rejectWithValue(error.message || "Update failed");
      }
    }
  }
);
