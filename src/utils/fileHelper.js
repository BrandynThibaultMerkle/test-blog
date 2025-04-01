/**
 * File helpers for handling blog post creation and file management
 * This version uses the local API server to update files directly
 */

// Base URL for API server
const API_BASE_URL = 'http://localhost:3001/api'

/**
 * Creates or updates a blog post through the API server
 * @param {Object} blogPost - The blog post object to add
 * @param {Object} metadata - Current blog metadata
 * @returns {Promise} - A promise that resolves when the operation is complete
 */
export const createOrUpdateBlogPost = async (blogPost, metadata) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        post: blogPost,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to create blog post')
    }

    const result = await response.json()

    return {
      success: result.success,
      message: result.message,
      metadata: result.metadata,
    }
  } catch (error) {
    console.error('Error creating blog post:', error)
    throw error
  }
}

/**
 * Fetch the current blog metadata from the API server
 * @returns {Promise<Object>} - The metadata object
 */
export const fetchBlogMetadata = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/metadata`)

    if (!response.ok) {
      throw new Error('Failed to fetch metadata')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching metadata:', error)
    return { totalPosts: 0, totalPages: 0, postsPerPage: 10 }
  }
}
