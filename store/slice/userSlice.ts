import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

export interface UserState {
  _id: string;
  name: string;
  email: string;
  photo: string;
  password?: string;
  orderedProduct?: string[];
  type: "credential" | "google";
  role: "admin" | "user";
  gender: "male" | "female";
  dob: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSliceState {
  userData: UserState | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserSliceState = {
  userData: null,
  isLoading: false,
  error: null,
};

// Async thunk to fetch user data
export const fetchUserData = createAsyncThunk<
  UserState,
  void,
  { state: RootState }
>("user/fetchUserData", async (_, { getState }) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/user/me`
    );

    return response.data.data;
  } catch (error: any) {
    console.log(error.response.data.message);
  }
});

// Redux slice for user data
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<UserState>) => {
      state.userData = action.payload;
      state.isLoading = false;
    },
    setUserNull: (state) => {
      state.userData = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "An error occurred.";
      });
  },
});
export const { updateUser, setUserNull } = userSlice.actions;

export default userSlice.reducer;
