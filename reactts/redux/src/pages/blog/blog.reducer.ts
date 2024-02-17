import { createAction, createReducer, nanoid } from '@reduxjs/toolkit'
import { initalPostList } from '~/constants/blog'
import { Post } from '~/types/blog.type'

interface BlogState {
  postList: Post[]
  editingPost: Post | null
}

const initalState: BlogState = {
  postList: initalPostList,
  editingPost: null
}

export const addPost = createAction('blog/addPost', (post: Omit<Post, 'id'>) => {
  return {
    payload: {
      ...post,
      id: nanoid()
    }
  }
})
export const deletePost = createAction<string>('blog/deletePost')
export const editPost = createAction<string>('blog/editPost')
export const cancelEditPost = createAction('blog/cancelEditPost')
export const updatePost = createAction<Post>('blog/updatePost')
const blogReducer = createReducer(initalState, (builder) => {
  builder
    .addCase(addPost, (state, action) => {
      state.postList.push(action.payload)
    })
    .addCase(deletePost, (state, action) => {
      const postId = action.payload
      state.postList = state.postList.filter((post) => post.id !== postId)
    })
    .addCase(editPost, (state, action) => {
      const postId = action.payload
      const findPost = state.postList.find((post) => post.id === postId) || null
      state.editingPost = findPost
    })
    .addCase(cancelEditPost, (state) => {
      state.editingPost = null
    })
    .addCase(updatePost, (state, action) => {
      const newPost = action.payload
      const index = state.postList.findIndex((post) => post.id === newPost.id)
      state.postList[index] = newPost
      state.editingPost = null
    })
})
export default blogReducer
