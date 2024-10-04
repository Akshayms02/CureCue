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

    console.log(response)

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
  date: Date
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
