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

const decodeToken = (token) => {
  if (token) {
    const userInfo = jwtDecode(token)
    return userInfo
  } else {
    return ""
  }
}
// End Method

export const authReducer = createSlice({
  name: "auth",
  initialState: {
    isLoading: false,
    userInfo: decodeToken(localStorage.getItem("token")),
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
    })
    builder.addCase(signup.rejected, (state, { payload }) => {
      state.errorMessage = payload?.error || payload?.message || "Signup failed"
      state.isLoading = false
    })

    builder.addCase(login.rejected, (state, { payload }) => {
      state.errorMessage = payload?.error || payload?.message || "Login failed"
      state.isLoading = false
    })

    builder.addCase(logout.rejected, (state, { payload }) => {
      state.errorMessage = payload?.error || payload?.message || "Logout failed"
      state.isLoading = false
    })
  },
})
export const { messageClear } = authReducer.actions
export default authReducer.reducer
