import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../api/api"

export const get_notifications = createAsyncThunk(
  "notifications/get_notifications",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/notifications", {
        withCredentials: true,
      })
      console.log("get_notifications", data)
      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

const notificationsReducer = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    isLoading: "",
    errorMessage: "",
    successMessage: "",
  },

  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = ""
    },
  },
  extraReducers: (builder) => {
    builder.addCase(get_notifications.fulfilled, (state, { payload }) => {
      const filteredNotifications = payload.filter((notification) => {
        return (
          notification.type !== "like" ||
          notification.from._id !== notification.to._id
        )
      })

      state.notifications = filteredNotifications
      state.isLoading = false
    })

    builder.addCase(get_notifications.pending, (state, { payload }) => {
      state.isLoading = true
    })

    builder.addCase(get_notifications.rejected, (state, { payload }) => {
      state.errorMessage = payload.error || "An error occurred"
      state.isLoading = false
    })
  },
})

export const { messageClear } = notificationsReducer.actions
export default notificationsReducer.reducer
