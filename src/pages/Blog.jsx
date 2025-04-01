import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'

function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [metadata, setMetadata] = useState({ totalPages: 1 })

  const { page = 1 } = useParams()
  const currentPage = parseInt(page) || 1
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    setError(null)

    fetch(`/data/blog-page-${currentPage}.json`)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to load blog posts')
        return response.json()
      })
      .then((data) => {
        setPosts(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
        if (currentPage !== 1) {
          navigate('/blog/page/1')
        }
      })

    fetch('/data/blog-metadata.json')
      .then((response) => response.json())
      .then((data) => setMetadata(data))
      .catch(() => console.log('Could not load blog metadata'))
  }, [currentPage, navigate])

  if (loading)
    return (
      <div className='flex justify-center items-center py-20'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    )

  if (error)
    return (
      <div className='text-center py-16'>
        <h1 className='text-3xl font-bold mb-6'>Error</h1>
        <p className='text-xl text-gray-300 mb-8'>{error}</p>
        <Link
          to='/blog/page/1'
          className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors'>
          Return to Blog
        </Link>
      </div>
    )

  return (
    <div>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>Blog Posts</h1>
        <Link
          to='/blog/generator'
          className='bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors'>
          Create New Post
        </Link>
      </div>
      <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
        {posts.map((post) => (
          <div
            key={post.id}
            className='bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow'>
            <div className='p-6'>
              <p className='text-sm text-gray-400 mb-2'>
                {post.date} • {post.author}
              </p>
              <h2 className='text-xl font-semibold mb-3'>
                <Link
                  to={`/blog/post/${post.slug}`}
                  className='text-blue-400 hover:text-blue-300 transition-colors'>
                  {post.title}
                </Link>
              </h2>
              <p className='text-gray-300 mb-4'>{post.excerpt}</p>
              <Link
                to={`/blog/post/${post.slug}`}
                className='inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors'>
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className='mt-12 flex justify-center space-x-2'>
        {currentPage > 1 && (
          <Link
            to={`/blog/page/${currentPage - 1}`}
            className='px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 transition-colors'>
            Previous
          </Link>
        )}

        {Array.from({ length: metadata.totalPages }, (_, i) => (
          <Link
            key={i + 1}
            to={`/blog/page/${i + 1}`}
            className={`px-4 py-2 rounded transition-colors ${
              currentPage === i + 1
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}>
            {i + 1}
          </Link>
        ))}

        {currentPage < metadata.totalPages && (
          <Link
            to={`/blog/page/${currentPage + 1}`}
            className='px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 transition-colors'>
            Next
          </Link>
        )}
      </div>
    </div>
  )
}

export default Blog
