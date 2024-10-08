import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../api/api"

export const get_all_posts = createAsyncThunk(
  "post/get_all_posts",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/all", {
        withCredentials: true,
      })
      // console.log("get_all_posts", data)
      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const get_user_posts = createAsyncThunk(
  "post/get_user_posts",
  async (username, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/user/${username}`, {
        withCredentials: true,
      })
      // console.log("get_user_posts", data)
      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const create_post = createAsyncThunk(
  "post/create_post",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      // console.log("create_post", info)
      const { data } = await api.post("/create", info, {
        withCredentials: true,
      })
      // console.log("create_post", data)
      return fulfillWithValue(data)
    } catch (error) {
      if (error.response.status === 413) {
        return rejectWithValue({ error: "File size is too large" })
      }
      return rejectWithValue(error.response.data)
    }
  }
)

export const delete_post = createAsyncThunk(
  "post/delete_post",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      // console.log("id", id)
      const { data } = await api.delete(`/delete/${id}`, {
        withCredentials: true,
      })
      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const comment_post = createAsyncThunk(
  "post/comment_post",
  async ({ id, info }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(
        `/comment/${id}`,
        { text: info },
        {
          withCredentials: true,
        }
      )
      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const delete_comment = createAsyncThunk(
  "post/delete_comment",
  async ({ postId, commentId }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(
        `/comment/delete/${postId}/${commentId}`,
        {
          withCredentials: true,
        }
      )
      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const like_unlike_post = createAsyncThunk(
  "post/like_unlike_post",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        `/like/${id}`,
        {},
        { withCredentials: true }
      )
      return data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
export const postReducer = createSlice({
  name: "post",
  initialState: {
    isDeleting: false,
    isLoading: false,
    posts: [],
    post: {},
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
    builder.addCase(get_all_posts.fulfilled, (state, { payload }) => {
      state.posts = payload
      state.isLoading = false
    })
    builder.addCase(get_all_posts.pending, (state, { payload }) => {
      state.isLoading = true
    })
    builder.addCase(get_all_posts.rejected, (state, { payload }) => {
      state.isLoading = false
    })

    builder.addCase(get_user_posts.pending, (state, { payload }) => {
      state.isLoading = true
    })
    builder.addCase(get_user_posts.fulfilled, (state, { payload }) => {
      state.isLoading = false
      state.posts = payload
    })

    builder.addCase(create_post.pending, (state, { payload }) => {
      state.isLoading = true
    })
    builder.addCase(create_post.rejected, (state, { payload }) => {
      state.isLoading = false
      state.errorMessage = payload.error || "An error occurred"
    })
    builder.addCase(create_post.fulfilled, (state, { payload }) => {
      state.isLoading = false
      state.successMessage = payload.message || "Post created successfully"
      const post = payload
      state.posts.unshift(post)
    })

    builder.addCase(delete_post.pending, (state, { payload }) => {
      state.isDeleting = true
    })

    builder.addCase(delete_post.rejected, (state, { payload }) => {
      state.isDeleting = false
      state.errorMessage = payload.error
    })

    builder.addCase(delete_post.fulfilled, (state, { payload }) => {
      state.isDeleting = false
      state.successMessage = payload.message || "Post deleted successfully"
      state.posts = state.posts.filter((post) => post._id !== payload._id)
    })

    builder.addCase(comment_post.fulfilled, (state, { payload }) => {
      state.posts = state.posts.map((post) => {
        if (post._id === payload._id) {
          return {
            ...post,
            comments: payload.comments,
          }
        } else {
          return post
        }
      })
      state.isLoading = false
    })

    builder.addCase(comment_post.rejected, (state, { payload }) => {
      state.errorMessage = payload.error
      state.isLoading = false
    })

    builder.addCase(comment_post.pending, (state, { payload }) => {
      state.isLoading = true
    })

    builder.addCase(delete_comment.fulfilled, (state, { payload }) => {
      state.posts = state.posts.map((post) => {
        if (post._id === payload._id) {
          return {
            ...post,
            comments: [...payload.comments],
          }
        } else {
          return post
        }
      })
      state.isLoading = false
    })
    builder.addCase(delete_comment.rejected, (state, { payload }) => {
      state.errorMessage = payload?.error || "An unexpected error occurred"
      state.isLoading = false
    })

    builder.addCase(delete_comment.pending, (state, { payload }) => {
      state.isLoading = true
    })

    builder.addCase(like_unlike_post.fulfilled, (state, { payload }) => {
      state.posts = state.posts.map((post) =>
        post._id === payload._id ? { ...post, likes: payload.likes } : post
      )
    })

    builder.addCase(like_unlike_post.rejected, (state, { payload }) => {
      state.errorMessage = payload?.error || "An unexpected error occurred"
    })

    builder.addCase(like_unlike_post.pending, (state, { payload }) => {
      state.isLoading = true
    })
  },
})

export const { messageClear } = postReducer.actions
export default postReducer.reducer
