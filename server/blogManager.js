const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const htmlGenerator = require('./htmlGenerator')
const sitemapGenerator = require('./sitemapGenerator')

const app = express()
const PORT = 3001

app.use(cors())

app.use(bodyParser.json())

const DATA_DIR = path.join(__dirname, '../public/data')

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

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

const writeJsonFile = (filePath, data) => {
  try {
    const dirPath = path.dirname(filePath)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error)
    return false
  }
}

app.get('/api/metadata', (req, res) => {
  const metadataPath = path.join(DATA_DIR, 'blog-metadata.json')
  let metadata = readJsonFile(metadataPath)

  if (!metadata) {
    metadata = { totalPosts: 0, totalPages: 0, postsPerPage: 10 }
    writeJsonFile(metadataPath, metadata)
  }

  res.json(metadata)
})

app.post('/api/posts', (req, res) => {
  try {
    const { post } = req.body

    if (
      !post ||
      !post.title ||
      !post.author ||
      !post.excerpt ||
      !post.content
    ) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing required post data' })
    }
    // 1. Get current metadata
    const metadataPath = path.join(DATA_DIR, 'blog-metadata.json')
    let metadata = readJsonFile(metadataPath) || {
      totalPosts: 0,
      totalPages: 0,
      postsPerPage: 10,
    }

    let targetPage = 1

    if (metadata.totalPages > 0) {
      const lastPagePath = path.join(
        DATA_DIR,
        `blog-page-${metadata.totalPages}.json`
      )
      const lastPageData = readJsonFile(lastPagePath) || []

      if (lastPageData.length < metadata.postsPerPage) {
        targetPage = metadata.totalPages
      } else {
        targetPage = metadata.totalPages + 1
      }
    }

    const pageFilePath = path.join(DATA_DIR, `blog-page-${targetPage}.json`)
    let pageData = readJsonFile(pageFilePath) || []

    pageData.push(post)

    if (pageData.length > metadata.postsPerPage) {
      console.warn(
        `Page ${targetPage} has more than ${metadata.postsPerPage} posts. This shouldn't happen.`
      )
    }

    const pageWriteSuccess = writeJsonFile(pageFilePath, pageData)

    if (!pageWriteSuccess) {
      return res
        .status(500)
        .json({ success: false, message: 'Failed to write page data' })
    }

    metadata.totalPosts += 1
    metadata.totalPages = Math.max(metadata.totalPages, targetPage)

    const metadataWriteSuccess = writeJsonFile(metadataPath, metadata)

    if (!metadataWriteSuccess) {
      return res
        .status(500)
        .json({ success: false, message: 'Failed to update metadata' })
    }

    // Generate static HTML file for SEO
    const htmlResult = htmlGenerator.generateSinglePostHtml(post)
    if (!htmlResult.success) {
      console.error(
        `Warning: Failed to generate HTML for post ${post.slug}: ${htmlResult.error}`
      )
    }

    res.json({
      success: true,
      message: 'Blog post created successfully!',
      metadata,
      postId: post.id,
      page: targetPage,
    })
  } catch (error) {
    console.error('Error creating blog post:', error)
    res
      .status(500)
      .json({ success: false, message: `Server error: ${error.message}` })
  }
})

// Add new endpoint to generate HTML for all posts
app.get('/api/generate-html', async (req, res) => {
  try {
    const result = await htmlGenerator.generateAllPostHtml()
    res.json({
      success: result.success,
      message: `Generated ${result.count} HTML files for blog posts`,
      errors: result.errors,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error generating HTML files: ${error.message}`,
    })
  }
})

// Add endpoint to generate sitemap
app.get('/api/generate-sitemap', async (req, res) => {
  try {
    // Get the base URL from the request
    const baseUrl = req.query.baseUrl || `http://${req.headers.host}`

    const result = await sitemapGenerator.generateSitemap(baseUrl)

    if (result.success) {
      res.json({
        success: true,
        message: 'Sitemap generated successfully',
      })
    } else {
      res.status(500).json({
        success: false,
        message: `Error generating sitemap: ${result.error}`,
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error generating sitemap: ${error.message}`,
    })
  }
})

app.listen(PORT, () => {
  console.log(`Blog manager server running at http://localhost:${PORT}`)
  console.log(`Data directory: ${DATA_DIR}`)

  // Generate static HTML files for all existing posts on server start
  htmlGenerator
    .generateAllPostHtml()
    .then((result) => {
      if (result.success) {
        console.log(`Generated ${result.count} static HTML files for SEO`)
        if (result.errors.length > 0) {
          console.warn(`With ${result.errors.length} errors:`, result.errors)
        }
      } else {
        console.error('Failed to generate HTML files:', result.errors)
      }
    })
    .catch((err) => {
      console.error('Error during HTML generation:', err)
    })

  // Generate sitemap with Vercel URL
  sitemapGenerator
    .generateSitemap('https://test-blog-gamma-khaki.vercel.app')
    .then((result) => {
      if (result.success) {
        console.log('Sitemap generated successfully with Vercel URL')
      } else {
        console.error('Failed to generate sitemap:', result.error)
      }
    })
    .catch((err) => {
      console.error('Error during sitemap generation:', err)
    })
})

module.exports = app
