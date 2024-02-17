import { PayloadAction, createSlice, nanoid } from '@reduxjs/toolkit'
import { initalPostList } from '~/constants/blog'
import { Post } from '~/types/blog.type'

interface BlogState {
  postList: Post[]
  editingPost: Post | null
}

const initialState: BlogState = {
  postList: initalPostList,
  editingPost: null
}

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    deletePost: (state, action: PayloadAction<string>) => {
      const postId = action.payload
      state.postList = state.postList.filter((post) => post.id !== postId)
    },
    editPost: (state, action: PayloadAction<string>) => {
      const postId = action.payload
      const findPost = state.postList.find((post) => post.id === postId) || null
      state.editingPost = findPost
    },
    cancelEditPost: (state) => {
      state.editingPost = null
    },
    updatePost: (state, action: PayloadAction<Post>) => {
      const newPost = action.payload
      const index = state.postList.findIndex((post) => post.id === newPost.id)
      state.postList[index] = newPost
      state.editingPost = null
    },
    addPost: (state, action: PayloadAction<Post>) => {
      state.postList.push({
        ...action.payload,
        id: nanoid()
      })
    }
    // Cách 2 tiền xử lý dùng prepare
    // addPost: {
    //   reducer: (state, action: PayloadAction<Post>) => {
    //     const post = action.payload
    //     state.postList.push(post)
    //   },
    //   prepare: (post: Omit<Post, 'id'>) => ({
    //     payload: {
    //       ...post,
    //       id: nanoid()
    //     }
    //   })
    // }
  },
  // Nếu sủ dụng addDefaultCase hoặc addMatcher thì buộc sử dụng extraReducers
  extraReducers(builder) {
    builder.addDefaultCase(() => {
      console.log('Default case')
    })
  }
})

export const { addPost, deletePost, editPost, cancelEditPost, updatePost } = blogSlice.actions
const blogReducer = blogSlice.reducer
export default blogReducer
