import { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '~/store'
import { Post } from '~/types/blog.type'
import { addPost, cancelEditPost, updatePost } from '../../blog.slice'
import { unwrapResult } from '@reduxjs/toolkit'

interface ErrorForm {
  publishDate: string
}

const initalState: Post = {
  id: '',
  title: '',
  featuredImage: '',
  description: '',
  publishDate: '',
  published: false
}

export default function CreatePost() {
  const dispatch = useAppDispatch()
  const [formData, setFormData] = useState<Post>(initalState)
  const [errorForm, setErrorForm] = useState<null | ErrorForm>(null)
  const editingPost = useSelector((state: RootState) => state.blog.editingPost)

  useEffect(() => {
    setFormData(editingPost || initalState)
  }, [editingPost])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (editingPost) {
      dispatch(
        updatePost({
          postId: editingPost.id,
          body: formData
        })
      )
        .unwrap()
        .then(() => {
          setFormData(initalState)
          if (errorForm) {
            setErrorForm(null)
          }
        })
        .catch((error) => {
          setErrorForm(error.error)
        })
    } else {
      try {
        const formDataWithId = { ...formData, id: String(Date.now()) }
        const res = await dispatch(addPost(formDataWithId))
        unwrapResult(res) // unwrapResult nếu có lỗi sẽ nhảy vào catch
        setFormData(initalState)
        setErrorForm(null)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setErrorForm(error.error)
      }
    }
  }

  const handleCancelEdit = () => {
    dispatch(cancelEditPost())
  }

  return (
    <form className='md:px-10' onSubmit={handleSubmit}>
      <div className='mb-6'>
        <label htmlFor='title' className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
          Title
        </label>
        <input
          type='text'
          id='title'
          className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
          placeholder='Title'
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div className='mb-6'>
        <label htmlFor='featuredImage' className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
          Featured Image
        </label>
        <input
          type='text'
          id='featuredImage'
          className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
          placeholder='Url image'
          value={formData.featuredImage}
          onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
          required
        />
      </div>
      <div className='mb-6'>
        <div>
          <label htmlFor='description' className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-400'>
            Description
          </label>
          <textarea
            id='description'
            rows={3}
            className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
            placeholder='Your description...'
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>
      </div>
      <div className='mb-6'>
        <label
          htmlFor='publishDate'
          className={`mb-2 block text-sm font-medium  dark:text-gray-300 ${
            errorForm?.publishDate ? 'text-red-700' : 'text-gray-900'
          }`}
        >
          Publish Date
        </label>
        <input
          type='datetime-local'
          id='publishDate'
          className={`block w-56 rounded-lg border  p-2.5 text-sm  focus:outline-none  ${
            errorForm?.publishDate
              ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500'
          }`}
          placeholder='Title'
          required
          value={formData.publishDate}
          onChange={(event) => setFormData((prev) => ({ ...prev, publishDate: event.target.value }))}
        />
        {errorForm?.publishDate && (
          <p className='mt-2 text-sm text-red-600'>
            <span className='font-medium'>Lỗi! </span>
            {errorForm.publishDate}
          </p>
        )}
      </div>
      <div className='mb-6 flex items-center'>
        <input
          id='publish'
          checked={formData.published}
          onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
          type='checkbox'
          className='h-4 w-4 focus:ring-2 focus:ring-blue-500'
        />
        <label htmlFor='publish' className='ml-2 text-sm font-medium text-gray-900'>
          Publish
        </label>
      </div>
      <div>
        {editingPost && (
          <Fragment>
            <button
              type='submit'
              className='group relative mb-2 mx-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-teal-300 to-lime-300 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-lime-200 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 dark:focus:ring-lime-800'
            >
              <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
                Update Post
              </span>
            </button>
            <button
              onClick={handleCancelEdit}
              type='reset'
              className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-red-100 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 dark:focus:ring-red-400'
            >
              <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
                Cancel
              </span>
            </button>
          </Fragment>
        )}
        {!editingPost && (
          <button
            className='group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 group-hover:from-purple-600 group-hover:to-blue-500 dark:text-white dark:focus:ring-blue-800'
            type='submit'
          >
            <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
              Publish Post
            </span>
          </button>
        )}
      </div>
    </form>
  )
}
