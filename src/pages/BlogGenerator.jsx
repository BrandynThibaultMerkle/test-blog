import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createOrUpdateBlogPost, fetchBlogMetadata } from '../utils/fileHelper'

function BlogGenerator() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    excerpt: '',
    content: '',
  })
  const [previewMode, setPreviewMode] = useState(false)
  const [metadata, setMetadata] = useState({
    totalPosts: 0,
    totalPages: 0,
    postsPerPage: 10,
  })
  const [currentPageInfo, setCurrentPageInfo] = useState({
    pageNumber: 1,
    postCount: 0,
    isNewPage: false,
  })
  const [isCreating, setIsCreating] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [serverStatus, setServerStatus] = useState('checking')
  const navigate = useNavigate()

  useEffect(() => {
    const checkServerAndGetMetadata = async () => {
      try {
        const data = await fetchBlogMetadata()
        setMetadata(data)
        updateCurrentPageInfo(data)
        setServerStatus('online')
      } catch (error) {
        console.error('Server connection error:', error)
        setServerStatus('offline')
        setMessage({
          text: 'Cannot connect to blog server. Please start the server first.',
          type: 'error',
        })
      }
    }

    checkServerAndGetMetadata()
  }, [])

  const updateCurrentPageInfo = async (metadataInfo) => {
    try {
      let targetPage = 1
      let isNewPage = false
      let currentCount = 0

      if (metadataInfo.totalPages > 0) {
        const response = await fetch(
          `/data/blog-page-${metadataInfo.totalPages}.json`
        )
        if (response.ok) {
          const lastPageData = await response.json()
          currentCount = lastPageData.length

          if (currentCount < metadataInfo.postsPerPage) {
            targetPage = metadataInfo.totalPages
            isNewPage = false
          } else {
            targetPage = metadataInfo.totalPages + 1
            isNewPage = true
            currentCount = 0
          }
        }
      }

      setCurrentPageInfo({
        pageNumber: targetPage,
        postCount: currentCount,
        isNewPage: isNewPage,
      })
    } catch (error) {
      console.error('Error getting current page info:', error)
    }
  }

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const generateParagraphs = (content) => {
    if (!content.trim()) return []

    return content
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p !== '')
  }

  const generateBlogPostJSON = () => {
    const paragraphs = generateParagraphs(formData.content)

    const blogPost = {
      id: metadata.totalPosts + 1,
      slug: generateSlug(formData.title || 'untitled-post'),
      title: formData.title,
      date: new Date().toISOString().split('T')[0],
      author: formData.author,
      excerpt: formData.excerpt,
      content: {
        paragraphs: paragraphs,
      },
    }

    return blogPost
  }

  const createBlogPost = async () => {
    if (serverStatus !== 'online') {
      setMessage({
        text: 'Cannot connect to blog server. Please start the server first and refresh this page.',
        type: 'error',
      })
      return
    }

    if (
      !formData.title ||
      !formData.author ||
      !formData.excerpt ||
      !formData.content
    ) {
      setMessage({
        text: 'Please fill in all fields',
        type: 'error',
      })
      return
    }

    setIsCreating(true)
    setMessage({ text: '', type: '' })

    try {
      const newPost = generateBlogPostJSON()

      const result = await createOrUpdateBlogPost(newPost, metadata)

      setMetadata(result.metadata)

      updateCurrentPageInfo(result.metadata)

      setMessage({
        text: result.message,
        type: 'success',
      })

      setTimeout(() => {
        setFormData({
          title: '',
          author: '',
          excerpt: '',
          content: '',
        })
      }, 2000)
    } catch (error) {
      console.error('Error creating blog post:', error)
      setMessage({
        text: `Error creating blog post: ${error.message}`,
        type: 'error',
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className='max-w-4xl mx-auto'>
      <h1 className='text-3xl font-bold mb-8'>Blog Post Generator</h1>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-800' : 'bg-red-800'
          }`}>
          {message.text}
        </div>
      )}

      <div className='mb-6 flex items-center'>
        <div className='mr-2'>Server Status:</div>
        {serverStatus === 'checking' && (
          <div className='flex items-center'>
            <div className='h-3 w-3 bg-yellow-500 rounded-full mr-2'></div>
            <span>Checking...</span>
          </div>
        )}
        {serverStatus === 'online' && (
          <div className='flex items-center'>
            <div className='h-3 w-3 bg-green-500 rounded-full mr-2'></div>
            <span>Online</span>
          </div>
        )}
        {serverStatus === 'offline' && (
          <div className='flex items-center'>
            <div className='h-3 w-3 bg-red-500 rounded-full mr-2'></div>
            <span>
              Offline - Please start the server in the "server" folder
            </span>
          </div>
        )}
      </div>

      <div className='mb-6 flex space-x-4'>
        <button
          className={`px-4 py-2 rounded-lg ${
            !previewMode
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-200'
          }`}
          onClick={() => setPreviewMode(false)}>
          Edit Mode
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            previewMode ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'
          }`}
          onClick={() => setPreviewMode(true)}>
          Preview Mode
        </button>
      </div>

      {!previewMode ? (
        <div className='bg-gray-800 p-6 rounded-lg'>
          <div className='mb-4'>
            <label className='block text-gray-300 mb-2' htmlFor='title'>
              Title
            </label>
            <input
              type='text'
              id='title'
              name='title'
              value={formData.title}
              onChange={handleChange}
              className='w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Enter post title'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-gray-300 mb-2' htmlFor='author'>
              Author
            </label>
            <input
              type='text'
              id='author'
              name='author'
              value={formData.author}
              onChange={handleChange}
              className='w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Enter author name'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-gray-300 mb-2' htmlFor='excerpt'>
              Excerpt
            </label>
            <textarea
              id='excerpt'
              name='excerpt'
              value={formData.excerpt}
              onChange={handleChange}
              className='w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Enter a brief excerpt'
              rows='3'></textarea>
          </div>

          <div className='mb-4'>
            <label className='block text-gray-300 mb-2' htmlFor='content'>
              Content
            </label>
            <div className='mb-2 text-sm text-gray-400'>
              Press Enter twice to create a new paragraph. Your spacing will be
              preserved.
            </div>
            <textarea
              id='content'
              name='content'
              value={formData.content}
              onChange={handleChange}
              className='w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Write your blog post content here...'
              rows='15'></textarea>
          </div>

          <div className='mt-8 border-t border-gray-700 pt-6 flex space-x-4'>
            <button
              onClick={createBlogPost}
              disabled={isCreating || serverStatus !== 'online'}
              className={`px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors ${
                isCreating || serverStatus !== 'online'
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}>
              {isCreating ? 'Creating...' : 'Create Blog Post'}
            </button>

            <div className='flex-grow'></div>

            <div className='text-sm text-gray-400 self-center'>
              {serverStatus === 'online' ? (
                <>
                  This will add the blog post to page{' '}
                  {currentPageInfo.pageNumber}
                  {currentPageInfo.isNewPage ? (
                    <span className='ml-1 text-yellow-400'>
                      (creating a new page)
                    </span>
                  ) : (
                    <span className='ml-1'>
                      (currently has {currentPageInfo.postCount} post
                      {currentPageInfo.postCount !== 1 ? 's' : ''})
                    </span>
                  )}
                </>
              ) : (
                <span className='text-red-400'>
                  Server connection required to create posts
                </span>
              )}
            </div>
          </div>

          <div className='mt-8 border-t border-gray-700 pt-6'>
            <h3 className='text-xl font-semibold mb-4'>Preview JSON</h3>
            <pre className='bg-gray-900 p-4 rounded overflow-x-auto text-sm'>
              {JSON.stringify(generateBlogPostJSON(), null, 2)}
            </pre>
          </div>
        </div>
      ) : (
        <div className='bg-gray-800 p-6 rounded-lg'>
          <div className='mb-6 text-sm text-gray-400'>
            Preview Mode - This is how your post will appear
          </div>

          <article className='prose prose-invert prose-lg max-w-none'>
            <h1 className='text-3xl font-bold mb-4'>
              {formData.title || 'Your Post Title'}
            </h1>

            <div className='flex items-center text-gray-400 mb-8'>
              <span className='mr-4'>
                {new Date().toISOString().split('T')[0]}
              </span>
              <span>By {formData.author || 'Author Name'}</span>
            </div>

            <div>
              {generateParagraphs(formData.content).length > 0 ? (
                generateParagraphs(formData.content).map((paragraph, index) => (
                  <p key={index} className='mb-6'>
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className='text-gray-500 italic'>
                  No content yet. Add some text to see your post.
                </p>
              )}
            </div>
          </article>

          <div className='mt-8 pt-6 border-t border-gray-700'>
            <button
              onClick={createBlogPost}
              disabled={isCreating || serverStatus !== 'online'}
              className={`px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors ${
                isCreating || serverStatus !== 'online'
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}>
              {isCreating ? 'Creating...' : 'Create Blog Post'}
            </button>
          </div>
        </div>
      )}

      <div className='mt-6'>
        <Link
          to='/blog/page/1'
          className='text-blue-400 hover:text-blue-300 transition-colors'>
          ← Back to Blog
        </Link>
      </div>
    </div>
  )
}

export default BlogGenerator
