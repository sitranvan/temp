export default function PostTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className='md:mx-6 mb-8 text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl lg:text-5xl'>
      <span className='text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400'>{children}</span>
    </h1>
  )
}
