import axiosUrl from "../../Utils/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const API = "/api/admin";
export const login = createAsyncThunk(
  "admin/adminLogin",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosUrl.post(`${API}/login`, { email, password });
      console.log("login thunk", response.data.response);
      return response.data.response;
    } catch (error: any) {
      if (error.response) {
        const errorMessage = error.response.data.message || "Login failed";
        console.log("vvvvvv", errorMessage);
        return rejectWithValue(errorMessage);
      } else if (error.request) {
        return rejectWithValue("No response from server.");
      } else {
        return rejectWithValue(error.message || "Login failed");
      }
    }
  }
);

export const addSpecialization = ({
  name,
  description,
}: {
  name: string;
  description: string;
}): any => {
  return async () => {
    try {
      const response = await axiosUrl.post(`${API}/addSpecialization`, {
        name,
        description,
      });
      if (response) {
        console.log("qqqqqqqq", response);
        return response;
      }
      return response;
    } catch (error: any) {
      console.log(error.response);
      return error.response;
    }
  };
};
export const updateSpecialization = ({
  id,
  name,
  description,
}: {
  id: number;
  name: string;
  description: string;
}): any => {
  return async () => {
    try {
      console.log(id, name, description);

      const response = await axiosUrl.put(`${API}/updateSpecialization`, {
        id,
        name,
        description,
      });
      if (response) {
        console.log("qqqqqqqq", response);
        return response;
      }
      return response;
    } catch (error: any) {
      console.log(error.response);
      return error.response;
    }
  };
};
export const listUnlistSpecialization = ({ id }: { id: number }): any => {
  return async () => {
    try {
      console.log(id);

      const response = await axiosUrl.put(`${API}/listUnlistSpecialization`, {
        id,
      });
      if (response) {
        return response;
      }
      return response;
    } catch (error: any) {
      console.log(error.response);
      return error.response;
    }
  };
};
