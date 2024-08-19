import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../api/api"

export const get_suggested_users = createAsyncThunk(
  "user/get_suggested_users",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/suggested", {
        withCredentials: true,
      })

      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const get_user_profile = createAsyncThunk(
  "user/get_user_profile",
  async (username, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/profile/${username}`, {
        withCredentials: true,
      })
      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const userReducer = createSlice({
  name: "user",
  initialState: {
    isLoading: false,
    users: [],
    user: {
      following: [],
      followers: [],
    },
  },
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(get_suggested_users.pending, (state, { payload }) => {
      state.isLoading = true
    })
    builder.addCase(get_suggested_users.fulfilled, (state, { payload }) => {
      state.isLoading = false
      state.users = payload
    })

    builder.addCase(get_user_profile.pending, (state, { payload }) => {
      state.isLoading = true
    })

    builder.addCase(get_user_profile.fulfilled, (state, { payload }) => {
      state.isLoading = false
      state.user = payload
    })
  },
})

export default userReducer.reducer
