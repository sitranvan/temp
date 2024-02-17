import { configureStore } from '@reduxjs/toolkit'
import blogReducer from './pages/blog/blog.slice'
import { useDispatch } from 'react-redux'
export const store = configureStore({
  reducer: {
    blog: blogReducer
  }
})
// Lấy ra kiểu dữ liệu của state và dispatch từ store để sử dụng trong các component
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
// Dùng cho thunk
export const useAppDispatch = () => useDispatch<AppDispatch>()
