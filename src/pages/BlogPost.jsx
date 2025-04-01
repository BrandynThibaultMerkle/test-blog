import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

function BlogPost() {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { slug } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    setError(null)

    const checkPage = async (pageNum) => {
      try {
        const response = await fetch(`/data/blog-page-${pageNum}.json`)
        if (!response.ok) return null

        const posts = await response.json()
        return posts.find((p) => p.slug === slug)
      } catch (err) {
        return null
      }
    }

    const findPost = async () => {
      try {
        const metaResponse = await fetch('/data/blog-metadata.json')
        const metadata = await metaResponse.json()

        for (let i = 1; i <= metadata.totalPages; i++) {
          const foundPost = await checkPage(i)
          if (foundPost) {
            setPost(foundPost)
            setLoading(false)
            return
          }
        }

        setError('Blog post not found')
        setLoading(false)
      } catch (err) {
        setError('Failed to load blog post')
        setLoading(false)
      }
    }

    findPost()
  }, [slug])

  if (loading)
    return (
      <div className='flex justify-center items-center py-20'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    )

  if (error || !post) {
    return (
      <div className='text-center py-16'>
        <h1 className='text-3xl font-bold mb-6'>Blog Post Not Found</h1>
        <p className='text-xl text-gray-300 mb-8'>
          Sorry, the blog post you are looking for does not exist.
        </p>
        <Link
          to='/blog/page/1'
          className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors'>
          Return to Blog
        </Link>
      </div>
    )
  }

  return (
    <article className='max-w-3xl mx-auto'>
      <button
        onClick={() => navigate(-1)}
        className='text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-2 transition-colors'>
        <span>← Back</span>
      </button>

      <h1 className='text-3xl font-bold mb-4'>{post.title}</h1>

      <div className='flex items-center text-gray-400 mb-8'>
        <span className='mr-4'>{post.date}</span>
        <span>By {post.author}</span>
      </div>

      <div className='prose prose-invert prose-lg max-w-none'>
        {post.content.paragraphs.map((paragraph, index) => (
          <p key={index} className='mb-6'>
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  )
}

export default BlogPost
