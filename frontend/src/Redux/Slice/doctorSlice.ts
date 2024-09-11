import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { login } from "../Actions/doctorActions";

interface User {
  name: string;
  doctorId: string;
  phone: string;
  email: string;
  isBlocked: boolean;
}

interface UserState {
  doctorInfo: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  doctorInfo: null,
  loading: false,
  error: null,
};

const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {
    clearUser(state) {
      state.doctorInfo = null;
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
          action: PayloadAction<{ docaccessToken: string; doctorInfo: User }>
        ) => {
          const { docaccessToken, doctorInfo } = action.payload;
          state.doctorInfo = doctorInfo;
          localStorage.setItem("docaccessToken", docaccessToken);

          localStorage.setItem("doctorInfo", JSON.stringify(doctorInfo));
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Login failed";
      });
  },
});

export const { clearUser, setLoading, setError } = doctorSlice.actions;
export default doctorSlice.reducer;
