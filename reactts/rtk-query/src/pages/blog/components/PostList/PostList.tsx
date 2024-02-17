import { Fragment } from 'react'
import { useDeletePostMutation, useGetPostsQuery } from '../../blog.service'
import PostItem from '../PostItem'
import Skeleton from '~/components/Skeleton'
import { useDispatch } from 'react-redux'
import { startEditPost } from '../../blog.slice'

// isLoading chỉ dành cho lần load đầu tiên, sau đó sẽ không còn dùng nữa
// isFetching là cho mỗi lần fetch lại dữ liệu (thường được dùng để hiển thị loading)

export default function PostList() {
  const dispatch = useDispatch()
  const { data, isFetching } = useGetPostsQuery()
  const [deletePost] = useDeletePostMutation()
  const hanldeStartEditPost = (id: string) => {
    dispatch(startEditPost(id))
  }
  const handleDeletePost = async (id: string) => {
    await deletePost(id).unwrap()
  }
  return (
    <div className='bg-white py-6 sm:py-8 lg:py-12'>
      <div className='mx-auto max-w-screen-xl px-4 md:px-8'>
        <div className='mb-10 md:mb-16'>
          <h2 className='mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl'>Trần Văn Sĩ</h2>
          <p className='mx-auto max-w-screen-md text-center text-gray-500 md:text-lg'>
            Đừng bao giờ từ bỏ. Hôm nay khó khăn, ngày mai sẽ trở nên tồi tệ. Nhưng ngày mốt sẽ có nắng
          </p>
        </div>
        <div className='grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-2 xl:grid-cols-2 xl:gap-8'>
          {isFetching && (
            <Fragment>
              <Skeleton />
              <Skeleton />
            </Fragment>
          )}
          {!isFetching &&
            data?.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                hanldeStartEditPost={hanldeStartEditPost}
                handleDeletePost={handleDeletePost}
              />
            ))}
        </div>
      </div>
    </div>
  )
}
