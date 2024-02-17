import { AsyncThunk, PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ThunkApiMetaConfig } from 'node_modules/@reduxjs/toolkit/dist/query/core/buildThunks'
import { Post } from '~/types/blog.type'
import http from '~/utils/http'

// Khai báo kiểu cho các action của slice này dùng chung cho các action async và sync (nếu có)
type GenericAsyncThunk = AsyncThunk<unknown, unknown, ThunkApiMetaConfig>
type PendingAction = ReturnType<GenericAsyncThunk['pending']>
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>

interface BlogState {
  postList: Post[]
  editingPost: Post | null
  loading?: boolean
  currentRequestId?: string
}

const initialState: BlogState = {
  postList: [],
  editingPost: null,
  loading: false,
  currentRequestId: undefined
}

export const getPostList = createAsyncThunk('blog/getPostList', async (_, thunkApi) => {
  const res = await http.get<Post[]>('posts', {
    signal: thunkApi.signal
  })
  return res.data
})

export const addPost = createAsyncThunk('blog/addPost', async (body: Omit<Post, 'id'>, thunkApi) => {
  try {
    const res = await http.post<Post>('posts', body, {
      signal: thunkApi.signal
    })
    return res.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.name === 'AxiosError' && error.response.status === 422) {
      return thunkApi.rejectWithValue(error.response.data)
    }
    throw error
  }
})

export const updatePost = createAsyncThunk(
  'blog/updatePost',
  async ({ postId, body }: { postId: string; body: Post }, thunkApi) => {
    try {
      const response = await http.put<Post>(`posts/${postId}`, body, {
        signal: thunkApi.signal
      })
      return response.data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.name === 'AxiosError' && error.response.status === 422) {
        return thunkApi.rejectWithValue(error.response.data)
      }
      throw error
    }
  }
)

export const deletePost = createAsyncThunk('blog/deletePost', async (postId: string, thunkApi) => {
  await http.delete(`posts/${postId}`, {
    signal: thunkApi.signal
  })
  return postId
})

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  // Với case nào không dùng bất đồng bộ thì sử dụng reducers
  reducers: {
    editPost: (state, action: PayloadAction<string>) => {
      const postId = action.payload
      const findPost = state.postList.find((post) => post.id === postId) || null
      state.editingPost = findPost
    },
    cancelEditPost: (state) => {
      state.editingPost = null
    }
  },
  // Nếu sủ dụng addDefaultCase hoặc addMatcher thì buộc sử dụng extraReducers
  extraReducers(builder) {
    builder
      .addCase(getPostList.fulfilled, (state, action) => {
        state.postList = action.payload
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.postList.push(action.payload)
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        // action.meta.arg hoặc action.payload để lấy ra giá trị truyền vào khi gọi action
        state.postList = state.postList.filter((post) => post.id !== action.payload)
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const newPost = action.payload
        const index = state.postList.findIndex((post) => post.id === newPost.id)
        state.postList[index] = newPost
        state.editingPost = null
      })

      // Xử lí loading
      .addMatcher<PendingAction>(
        (action) => action.type.endsWith('/pending'),
        (state, action) => {
          state.loading = true
          state.currentRequestId = action.meta.requestId
        }
      )
      .addMatcher<RejectedAction | FulfilledAction>(
        (action) => action.type.endsWith('/rejected') || action.type.endsWith('/fulfilled'),
        (state, action) => {
          // Nếu loading và requestId của action này trùng với requestId hiện tại thì set loading = false
          if (state.loading && state.currentRequestId === action.meta.requestId) {
            state.loading = false
            state.currentRequestId = undefined
          }
        }
      )
  }
})

export const { cancelEditPost, editPost } = blogSlice.actions
const blogReducer = blogSlice.reducer
export default blogReducer
