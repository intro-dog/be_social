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

export const follow_user = createAsyncThunk(
  "user/follow_user",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(`/follow/${id}`, {
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
    errorMessage: "",
    successMessage: "",
    users: [],
    user: {},
  },
  reducers: {
    clearMessage: (state) => {
      state.errorMessage = ""
      state.successMessage = ""
    },
  },

  extraReducers: (builder) => {
    builder.addCase(get_suggested_users.pending, (state, { payload }) => {
      state.isLoading = true
    })
    builder.addCase(get_suggested_users.rejected, (state, { payload }) => {
      state.isLoading = false
    })
    builder.addCase(get_suggested_users.fulfilled, (state, { payload }) => {
      state.isLoading = false
      state.users = payload
    })

    builder.addCase(get_user_profile.pending, (state, { payload }) => {
      state.isLoading = true
    })

    builder.addCase(get_user_profile.rejected, (state, { payload }) => {
      state.isLoading = false
    })

    builder.addCase(get_user_profile.fulfilled, (state, { payload }) => {
      state.isLoading = false
      state.user = payload
    })

    builder.addCase(follow_user.pending, (state, { payload }) => {
      state.isLoading = true
    })

    builder.addCase(follow_user.rejected, (state, { payload }) => {
      state.errorMessage = payload.error
      state.isLoading = false
    })

    builder.addCase(follow_user.fulfilled, (state, { payload }) => {
      state.successMessage = payload.message
      state.isLoading = false

      if (state.user._id === payload.userId) {
        state.user = {
          ...state.user,
          followers: payload.followers,
        }
      }
    })
  },
})

export const { clearMessage } = userReducer.actions
export default userReducer.reducer
