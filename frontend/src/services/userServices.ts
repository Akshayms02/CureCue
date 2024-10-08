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

export const getDepartments = async () => {
  try {
    const response = await axiosUrl.get("/api/user/specializations");
    if (response?.data) {
      return response.data;
    }
    return [];
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
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

export const fetchAvialableTimeslots = async (doctorId: string,date:string) => {
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
