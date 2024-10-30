import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosUrl from "../../Utils/axios";
import doctorAxiosUrl from "../../Utils/doctorAxios";

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
      console.log("sfsfs", response);
      const { docaccessToken, doctorInfo } = response.data.Credentials;

      return { docaccessToken, doctorInfo };
    } catch (error: any) {
      console.log("eee", error.response.data.message);
      return rejectWithValue(error.response.data.message || "Login failed");
    }
  }
);

export const uploadDoctorData = createAsyncThunk(
  "doctor/uploadData",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axiosUrl.post(
        "/api/doctor/uploadDoctorKycDetails",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const { kycStatus } = response.data;

      return { kycStatus };
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.response || "Upload Failed");
    }
  }
);

export const updateDoctorProfile = createAsyncThunk(
  "doctor/updateDoctorProfile",
  async ({ doctorId, gender, fees, phone }: any, { rejectWithValue }) => {
    try {
      const response = await doctorAxiosUrl.put("/api/doctor/updateDoctor", {
        doctorId: doctorId,
        gender,
        fees,
        phone,
      });

      console.log("Thunkkkk response:", response.data.response);
      return response.data.response; // Adjust according to your API response structure
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
