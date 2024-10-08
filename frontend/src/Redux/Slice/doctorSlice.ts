import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { login, uploadDoctorData } from "../Actions/doctorActions";

interface Doctor {
  name: string;
  doctorId: string;
  phone: string;
  email: string;
  isBlocked: boolean;
  docStatus: string;
  DOB:string;
  department:any;
  fees:any;
  gender:any
}

interface DocState {
  doctorInfo: Doctor | null;
  loading: boolean;
  error: string | null;
  docStatus: string;
}

const initialState: DocState = {
  doctorInfo: null,
  loading: false,
  error: null,
  docStatus: "pending",
};

const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {
    clearUser(state) {
      state.doctorInfo = null;
    },
    setDocStatus(state, action: PayloadAction<{ kycStatus: string }>) {
      state.docStatus = action.payload.kycStatus;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (
          state,
          action: PayloadAction<{ docaccessToken: string; doctorInfo: Doctor }>
        ) => {
          const { docaccessToken, doctorInfo } = action.payload;
          console.log(doctorInfo)
          state.doctorInfo = doctorInfo;
          state.docStatus = doctorInfo.docStatus;
          localStorage.setItem("docaccessToken", docaccessToken);

          localStorage.setItem("doctorInfo", JSON.stringify(doctorInfo));
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Login failed";
      })
      .addCase(
        uploadDoctorData.fulfilled,
        (state, action: PayloadAction<{ kycStatus: string }>) => {
          const { kycStatus } = action.payload;
          state.docStatus = kycStatus;
        }
      );
  },
});

export const { clearUser, setLoading, setError ,setDocStatus} = doctorSlice.actions;
export default doctorSlice.reducer;
