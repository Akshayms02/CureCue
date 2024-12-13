import adminAxiosUrl from "../Utils/adminAxios";

export const getSpecializations = async () => {
  try {
    const response = await adminAxiosUrl.get("/api/admin/getSpecializations");

    if (response?.data?.response) {
      return response?.data.response;
    }
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export const adminLogout = async () => {
  try {
    const response = await adminAxiosUrl.post(`/api/admin/logout`);

    if (response) {
      console.log(response);
    }
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export const acceptDoctorApplication = async (doctorId: string) => {
  try {
    const response = await adminAxiosUrl.post(
      `/api/admin/accept-doctor/${doctorId}`
    );

    if (response) {
      console.log(response);
    }
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export const rejectDoctor = async (doctorId: string) => {
  try {
    const response = await adminAxiosUrl.post(
      `/api/admin/reject-doctor/${doctorId}`
    );
    if (response) {
      console.log(response);
    }
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export const getApplications = async () => {
  try {
    const response = await adminAxiosUrl.get("/api/admin/getApplications");
    if (response?.data?.response) {
      return response.data.response;
    }
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export const viewApplications = async (id: string) => {
  try {
    const response = await adminAxiosUrl.get(
      `/api/admin/doctorApplication/${id}`
    );
    if (response?.data?.data) {
      return response.data.data;
    }
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export const getDoctors = async () => {
  try {
    const response = await adminAxiosUrl.get("/api/admin/getDoctors");
    if (response) {
      return response.data.response;
    }
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export const listUnlistDoctor = async (id: string) => {
  try {
    const response = await adminAxiosUrl.put(
      `/api/admin/listUnlistDoctor/${id}`
    );
    if (response) {
      return response;
    }
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export const getAdminDashboard = async () => {
  try {
    const response = adminAxiosUrl.get("/api/admin/dashboardData");
    return response
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

export const getAllUsers = async (page: number, limit: number) => {
  try {
    const response = await adminAxiosUrl.get("/api/admin/getUsers", {
      params: { page, limit: limit },
    });

    return response
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

export const userBlockUnblock = async (id:string) => {
  try {
    const response = await adminAxiosUrl.put(`/api/admin/listUnlistUser/${id}`);

    return response
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}