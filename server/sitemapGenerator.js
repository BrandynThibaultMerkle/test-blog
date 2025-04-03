/**
 * Sitemap generator for blog posts
 * Generates a sitemap.xml file to help search engines discover content
 */

const fs = require('fs')
const path = require('path')

const DATA_DIR = path.join(__dirname, '../public/data')
const PUBLIC_DIR = path.join(__dirname, '../public')

// Set default base URL to the Vercel deployment
const DEFAULT_BASE_URL = 'https://test-blog-gamma-khaki.vercel.app'

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
 * Generate sitemap.xml for the blog
 * @param {string} baseUrl - Base URL of the website (e.g., https://example.com)
 * @returns {Promise<{success: boolean, error: string|null}>} - Result of the operation
 */
const generateSitemap = async (baseUrl = DEFAULT_BASE_URL) => {
  try {
    if (!baseUrl) {
      baseUrl = DEFAULT_BASE_URL
    }

    // Make sure the base URL ends with a trailing slash
    const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`

    // Read metadata to get the number of pages
    const metadataPath = path.join(DATA_DIR, 'blog-metadata.json')
    const metadata = readJsonFile(metadataPath)

    if (!metadata) {
      return { success: false, error: 'Metadata file not found' }
    }

    let urls = [
      // Add main pages
      { loc: `${normalizedBaseUrl}`, priority: '1.0', changefreq: 'weekly' },
      {
        loc: `${normalizedBaseUrl}blog/page/1`,
        priority: '0.9',
        changefreq: 'daily',
      },
    ]

    // Add blog page URLs
    for (let i = 2; i <= metadata.totalPages; i++) {
      urls.push({
        loc: `${normalizedBaseUrl}blog/page/${i}`,
        priority: '0.8',
        changefreq: 'daily',
      })
    }

    // Add individual blog post URLs - both React app routes and static HTML files
    for (let i = 1; i <= metadata.totalPages; i++) {
      const pageFilePath = path.join(DATA_DIR, `blog-page-${i}.json`)
      const posts = readJsonFile(pageFilePath)

      if (!posts) {
        console.warn(`Could not read blog page ${i} for sitemap generation`)
        continue
      }

      for (const post of posts) {
        if (post.slug) {
          // Add React app route
          urls.push({
            loc: `${normalizedBaseUrl}blog/post/${post.slug}`,
            priority: '0.7',
            changefreq: 'monthly',
            lastmod: post.date,
          })

          // Add static HTML file for search engines
          urls.push({
            loc: `${normalizedBaseUrl}blog/${post.slug}.html`,
            priority: '0.7',
            changefreq: 'monthly',
            lastmod: post.date,
          })
        }
      }
    }

    // Generate the sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

    // Write the sitemap file
    const sitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml')
    fs.writeFileSync(sitemapPath, sitemap, 'utf8')

    return { success: true, error: null }
  } catch (error) {
    return {
      success: false,
      error: `Failed to generate sitemap: ${error.message}`,
    }
  }
}

module.exports = {
  generateSitemap,
}
