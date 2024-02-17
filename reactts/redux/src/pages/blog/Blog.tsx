import CreatePost from './components/CreatePost'
import PostList from './components/PostList'
import PostTitle from './components/PostTitle'

export default function Blog() {
  return (
    <div className='p-5'>
      <PostTitle>Create Blog</PostTitle>
      <CreatePost />
      <PostList />
    </div>
  )
}
