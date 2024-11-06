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
  showIncomingVideoCall: any;
  videoCall: any;
  showVideoCallUser: false;
  roomIdUser: any;
}

const initialState: UserState = {
  userInfo: null,
  loading: false,
  error: null,
  showIncomingVideoCall: null,
  videoCall: null,
  showVideoCallUser: false,
  roomIdUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setShowIncomingVideoCall: (state, action) => {
      state.showIncomingVideoCall = action.payload;
    },
    setVideoCall: (state, action) => {
      state.videoCall = action.payload;
    },
    setShowVideoCall: (state, action) => {
      state.showVideoCallUser = action.payload;
    },
    setRoomId: (state, action) => {
      state.roomIdUser = action.payload;
    },
    endCallUser: (state) => {
      state.videoCall = null;
      state.showIncomingVideoCall = null;
      localStorage.removeItem("IncomingVideoCall");
    },
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

export const {
  clearUser,
  setLoading,
  setError,
  setShowIncomingVideoCall,
  setVideoCall,
  setShowVideoCall,
  setRoomId,
  endCallUser,
} = userSlice.actions;
export default userSlice.reducer;
