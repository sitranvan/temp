import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import blogReducer from './pages/blog/blog.slice'
import { blogApi } from './pages/blog/blog.service'
import { setupListeners } from '@reduxjs/toolkit/query'
export const store = configureStore({
  reducer: {
    blog: blogReducer,
    [blogApi.reducerPath]: blogApi.reducer // thêm reducer của blogApi vào store
  },
  // Thêm api middleware vào store để sử dụng các tính năng như catching, invalidating, polling, ...
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(blogApi.middleware)
})
// Optional: nhưng bắt buộc nếu dùng tính năng refrweshOnFocus/refetchOnReconnect
setupListeners(store.dispatch)

// Lấy ra kiểu dữ liệu của state và dispatch từ store để sử dụng trong các component
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
// Dùng cho thunk
export const useAppDispatch = () => useDispatch<AppDispatch>()
