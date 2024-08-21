import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { jwtDecode } from "jwt-decode"
import api from "../../api/api"

export const signup = createAsyncThunk(
  "auth/signup",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("signup", info, {
        withCredentials: true,
      })
      localStorage.setItem("token", data.token)
      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue({
        error: error.response?.data?.error || "Something went wrong",
      })
    }
  }
)

export const login = createAsyncThunk(
  "auth/login",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("login", info, {
        withCredentials: true,
      })
      localStorage.setItem("token", data.token)
      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue({
        error: error.response?.data?.error || "Something went wrong",
      })
    }
  }
)

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("logout")
      localStorage.removeItem("token")
      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue({
        error: error.response?.data?.error || "Something went wrong",
      })
    }
  }
)

export const get_me = createAsyncThunk(
  "auth/get_me",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/me", {
        withCredentials: true,
      })
      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const update_user = createAsyncThunk(
  "auth/update_user",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/update", info, {
        withCredentials: true,
      })
      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

const decodeToken = (token) => {
  if (token) {
    const userInfo = jwtDecode(token)
    return userInfo
  } else {
    return ""
  }
}

export const authReducer = createSlice({
  name: "auth",
  initialState: {
    isLoading: false,
    isUpdating: false,
    userInfo: decodeToken(localStorage.getItem("token")),
    user: {},
    errorMessage: "",
    successMessage: "",
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = ""
      state.successMessage = ""
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signup.pending, (state, { payload }) => {
      state.isLoading = true
    })

    builder.addCase(signup.fulfilled, (state, { payload }) => {
      const userInfo = decodeToken(payload.token)
      state.successMessage = payload.message
      state.isLoading = false
      state.userInfo = userInfo
    })

    builder.addCase(login.pending, (state, { payload }) => {
      state.isLoading = true
    })

    builder.addCase(login.fulfilled, (state, { payload }) => {
      const userInfo = decodeToken(payload.token)
      state.successMessage = payload.message
      state.isLoading = false
      state.userInfo = userInfo
    })

    builder.addCase(logout.pending, (state, { payload }) => {
      state.isLoading = true
    })

    builder.addCase(logout.fulfilled, (state, { payload }) => {
      state.successMessage = payload.message
      state.isLoading = false
      state.userInfo = ""
      state.user = {}
    })

    builder.addCase(signup.rejected, (state, { payload }) => {
      state.errorMessage = payload?.error || payload?.message || "Signup failed"
      state.isLoading = false
    })

    builder.addCase(login.rejected, (state, { payload }) => {
      state.errorMessage = payload?.error
      state.isLoading = false
    })

    builder.addCase(logout.rejected, (state, { payload }) => {
      // state.errorMessage = payload?.error
      state.isLoading = false
    })

    builder.addCase(get_me.pending, (state, { payload }) => {
      state.isLoading = true
    })

    builder.addCase(get_me.fulfilled, (state, { payload }) => {
      state.isLoading = false
      state.user = payload
    })

    builder.addCase(get_me.rejected, (state, { payload }) => {
      state.errorMessage =
        payload?.error || payload?.message || "Something went wrong"
      state.isLoading = false
    })

    builder.addCase(update_user.pending, (state, { payload }) => {
      state.isUpdating = true
      state.isLoading = true
    })

    builder.addCase(update_user.rejected, (state, { payload }) => {
      state.errorMessage =
        payload?.error || payload?.message || "Something went wrong"
      state.isUpdating = false
    })

    builder.addCase(update_user.fulfilled, (state, { payload }) => {
      state.successMessage = payload.message || "User updated successfully"
      state.isUpdating = false
      state.isLoading = false
      state.user = payload
    })
  },
})
export const { messageClear } = authReducer.actions
export default authReducer.reducer
