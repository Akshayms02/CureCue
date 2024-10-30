import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { login, updateUserProfile } from "../Actions/userActions";

interface User {
  name: string;
  userId: string;
  phone: string;
  email: string;
  isBlocked: boolean;
  DOB: string;
  gender: string;
}

interface UserState {
  userInfo: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userInfo: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser(state) {
      state.userInfo = null;
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
          action: PayloadAction<{ accessToken: string; userInfo: User }>
        ) => {
          const { accessToken, userInfo } = action.payload;
          state.userInfo = userInfo;
          localStorage.setItem("accessToken", accessToken);

          localStorage.setItem("userInfo", JSON.stringify(userInfo));
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Login failed";
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateUserProfile.fulfilled,
        (state, action: PayloadAction<{ userInfo: User }>) => {
          const { userInfo } = action.payload;
          state.userInfo = userInfo;
          state.loading = false;

          localStorage.setItem("userInfo", JSON.stringify(userInfo));
        }
      )
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Login failed";
      });
  },
});

export const { clearUser, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;
