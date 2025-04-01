import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className='py-16 text-center'>
      <h1 className='text-4xl font-bold mb-8'>This is a Test Marketing Site</h1>
      <p className='text-xl text-gray-300 max-w-2xl mx-auto'>
        Welcome to our test marketing site. This is a prototype for
        demonstrating a file-based blog system where your team can create blog
        posts without technical knowledge.
      </p>
      <div className='mt-12'>
        <Link
          to='/blog/page/1'
          className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors'>
          Check Out Our Blog
        </Link>
      </div>
    </div>
  )
}

export default Home
