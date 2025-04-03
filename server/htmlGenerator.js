/**
 * HTML Generator for blog posts
 * This module generates static HTML files for each blog post for SEO
 */

const fs = require('fs')
const path = require('path')

// Directory configurations
const DATA_DIR = path.join(__dirname, '../public/data')
const HTML_DIR = path.join(__dirname, '../public/blog')

// Ensure the blog directory exists
if (!fs.existsSync(HTML_DIR)) {
  fs.mkdirSync(HTML_DIR, { recursive: true })
}

/**
 * Read JSON file and parse its contents
 * @param {string} filePath - Path to the JSON file
 * @returns {Object|Array|null} - Parsed JSON data or null if error
 */
const readJsonFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(data)
    }
    return null
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error)
    return null
  }
}

/**
 * Generate HTML content for a blog post
 * @param {Object} post - Blog post data
 * @returns {string} - HTML content for the blog post
 */
const generatePostHtml = (post) => {
  const paragraphs = post.content.paragraphs
    .map((paragraph) => `    <p>${paragraph}</p>`)
    .join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.title}</title>
  <meta name="description" content="${post.excerpt}">
  <meta name="author" content="${post.author}">
  <link rel="stylesheet" href="/assets/css/style.css">
  <!-- Redirect to the React app when loaded by a browser -->
  <script>
    window.onload = function() {
      if (!window.navigator.userAgent.includes('Googlebot') && 
          !window.navigator.userAgent.includes('bingbot') && 
          !window.navigator.userAgent.includes('YandexBot')) {
        window.location.href = '/blog/post/${post.slug}';
      }
    }
  </script>
</head>
<body>
  <article>
    <h1>${post.title}</h1>
    <div class="post-meta">
      <span class="date">${post.date}</span>
      <span class="author">By ${post.author}</span>
    </div>
    <div class="content">
${paragraphs}
    </div>
  </article>
</body>
</html>`
}

/**
 * Generate static HTML files for all blog posts
 * @returns {Promise<{success: boolean, count: number, errors: Array}>} - Result of the operation
 */
const generateAllPostHtml = async () => {
  try {
    // Read metadata to get the number of pages
    const metadataPath = path.join(DATA_DIR, 'blog-metadata.json')
    const metadata = readJsonFile(metadataPath)

    if (!metadata) {
      return { success: false, count: 0, errors: ['Metadata file not found'] }
    }

    const totalPages = metadata.totalPages
    const errors = []
    let generatedCount = 0

    // Process each page of blog posts
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const pageFilePath = path.join(DATA_DIR, `blog-page-${pageNum}.json`)
      const posts = readJsonFile(pageFilePath)

      if (!posts) {
        errors.push(`Could not read blog page ${pageNum}`)
        continue
      }

      // Generate HTML file for each post
      for (const post of posts) {
        if (!post.slug) {
          errors.push(`Post with ID ${post.id} has no slug`)
          continue
        }

        try {
          const htmlContent = generatePostHtml(post)
          const htmlFilePath = path.join(HTML_DIR, `${post.slug}.html`)

          fs.writeFileSync(htmlFilePath, htmlContent, 'utf8')
          generatedCount++
        } catch (error) {
          errors.push(
            `Error generating HTML for post ${post.slug}: ${error.message}`
          )
        }
      }
    }

    return {
      success: true,
      count: generatedCount,
      errors: errors.length > 0 ? errors : [],
    }
  } catch (error) {
    return {
      success: false,
      count: 0,
      errors: [`Failed to generate HTML files: ${error.message}`],
    }
  }
}

/**
 * Generate HTML for a single blog post
 * @param {Object} post - Blog post data
 * @returns {Object} - Result of the operation
 */
const generateSinglePostHtml = (post) => {
  try {
    if (!post || !post.slug) {
      return { success: false, error: 'Invalid post data' }
    }

    const htmlContent = generatePostHtml(post)
    const htmlFilePath = path.join(HTML_DIR, `${post.slug}.html`)

    fs.writeFileSync(htmlFilePath, htmlContent, 'utf8')

    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Export the functions
module.exports = {
  generateAllPostHtml,
  generateSinglePostHtml,
}
