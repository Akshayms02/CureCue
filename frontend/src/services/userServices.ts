import axios from "axios";
import axiosUrl from "../Utils/axios";

export const getDepDoctors = async (departmentId: string) => {
  try {
    const response = await axiosUrl.get(
      `/api/user/getDepDoctors?departmentId=${departmentId}`
    );
    if (response) {
      return response.data;
    }
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export const userLogout = async () => {
  try {
    const response = await axiosUrl.post("/api/user/logout", {
      headers: {
        "Token-Type": "user",
      },
    });
    console.log(response);
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export const getDepartments = async (page: number) => {
  try {
    const response = await axiosUrl.get(`/api/user/specializations?page=${page}`);
    console.log(response)
    if (response?.data) {
      return {
        data: response.data.specializations,
        totalPages: response.data.totalPages,
      };
    }
    return { data: [], totalPages: 1 };
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
};

export const getDoctors = async () => {
  try {
    const { data } = await axiosUrl.get("/api/user/getDoctors");
    if (data) {
      return data;
    }
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export const getDoctorData = async (doctorId: string) => {
  try {
    const { data } = await axiosUrl.get(`/api/user/getDoctorData/${doctorId}`);
    console.log(data);

    return data;
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export const fetchAvialableTimeslots = async (doctorId: string, date: string) => {
  try {
    const response = await axiosUrl.get(`/api/user/getSlots/${doctorId}/${date}`);
    if (response) {
      return response;
    }
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export const changePassword = async (currentPassword: string, newPassword: string, userId: string) => {
  try {
    console.log(currentPassword, newPassword, userId)
    const response = await axiosUrl.post('/api/user/changePassword', { currentPassword, newPassword, userId });
    return response.data;
  } catch (error: unknown) {
    console.error(error)
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'An unknown error occurred');
    }
  }
}