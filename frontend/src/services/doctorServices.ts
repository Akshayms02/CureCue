import axios from "axios";
import doctorAxiosUrl from "../Utils/doctorAxios";

export const getSpecializations = async () => {
  try {
    const response = await doctorAxiosUrl.get("/api/admin/getSpecializations");
    if (response?.data?.response) {
      return response.data.response;
    }
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export const logoutDoctor = async () => {
  try {
    const response = await doctorAxiosUrl.post("/api/doctor/logout");

    console.log(response);
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export const checkSlots = async (
  doctorId: string | undefined,
  date: string
) => {
  try {
    const response = await doctorAxiosUrl.get(`/api/doctor/checkslots`, {
      params: {
        doctorId: doctorId,
        date: date,
      },
    });

    console.log(response);

    if (response?.data) {
      return response.data;
    }
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export const addSlots = async (requestBody: any) => {
  try {
    const response = await doctorAxiosUrl.post(
      "/api/doctor/slots",
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
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

export const deleteSlot = async (
  slotStart: string,
  doctorId: string | undefined,
  date: string
) => {
  try {
    const response = await doctorAxiosUrl.post("/api/doctor/deleteSlot", {
      start: slotStart,
      doctorId: doctorId,
      date: date,
    });
    if (response) {
      return response;
    }
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export const checkAvialability = async (requestBody: {
  doctorId: string | undefined;
  date: string;
  start: string;
  end: string;
}) => {
  try {
    const response = await doctorAxiosUrl.post(
      "/api/doctor/checkAvialability",
      requestBody
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

export const getDoctorData = async (doctorId: string) => {
  try {
    const response = await doctorAxiosUrl.get(
      `/api/doctor/getDoctorData/${doctorId}`
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

export const cancelAppointment = async (appointmentId: string, reason: string) => {
  try {
    const response = await doctorAxiosUrl
      .put("/api/doctor/cancelAppointment", {
        appointmentId: appointmentId,
        reason: reason,
      })

    return response
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
  }
}

export const addPrescription = async (appointmentId: string, reason: string) => {
  try {
    const response = await doctorAxiosUrl
      .put("/api/doctor/addPrescription", {
        appointmentId: appointmentId,
        prescription: reason,
      })
    return response
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
  }
}

export const getMedicalRecords = async (userId: string) => {
  try {
    const response = await doctorAxiosUrl.get(`/api/doctor/getMedicalRecords/${userId}`)
    return response
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
  }
}

export const getAllAppointments = async (doctorId: string, currentPage: number, statusFilter: string) => {
  try {
    const response = await doctorAxiosUrl.get(
      `/api/doctor/appointments/${doctorId}`,
      {
        params: {
          page: currentPage,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          limit: 4
        },
      }
    )
    return response
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
  }
}

export const fetchTwoMememberChat = async (doctorId: string, userId: string) => {
  try {
    const response = await doctorAxiosUrl.get(`/api/chat/fetchTwoMembersChat`, {
      params: {
        doctorID: doctorId,
        userID: userId,
        sender: "doctor"
      }
    });
    return response
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
  }
}

export const getDashboardData = async (doctorId: string) => {
  try {
    const response = await doctorAxiosUrl.get('/api/doctor/dashboardData', {
      params: { doctorId: doctorId },
    });
    return response
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
  }
}

export const getWalletData = async (doctorId: string, status: string, page: number) => {
  try {
    const response = await doctorAxiosUrl.get(`/api/doctor/getWallet/${doctorId}`, {
      params: { status, page, limit: 7 }
    })
    return response
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
  }
}

export const withDrawMoney = async (doctorId: string, value: string) => {
  try {
    const response = await doctorAxiosUrl.post(`/api/doctor/withdraw/${doctorId}`, {
      withdrawAmount: value,
    })
    return response
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
  }
}