/**
 * Regenerate SEO files
 * This script regenerates all HTML files and the sitemap
 */

const htmlGenerator = require('./htmlGenerator')
const sitemapGenerator = require('./sitemapGenerator')

// Base URL of the site
const SITE_URL = 'https://test-blog-gamma-khaki.vercel.app'

async function regenerate() {
  console.log('Regenerating SEO files...')

  try {
    // Generate HTML files
    console.log('Generating HTML files...')
    const htmlResult = await htmlGenerator.generateAllPostHtml()

    if (htmlResult.success) {
      console.log(`Generated ${htmlResult.count} HTML files successfully`)
      if (htmlResult.errors.length > 0) {
        console.warn(
          `With ${htmlResult.errors.length} errors:`,
          htmlResult.errors
        )
      }
    } else {
      console.error('Failed to generate HTML files:', htmlResult.errors)
    }

    // Generate sitemap
    console.log('Generating sitemap...')
    const sitemapResult = await sitemapGenerator.generateSitemap(SITE_URL)

    if (sitemapResult.success) {
      console.log('Sitemap generated successfully')
    } else {
      console.error('Failed to generate sitemap:', sitemapResult.error)
    }

    console.log('SEO file regeneration complete')
  } catch (error) {
    console.error('Error regenerating SEO files:', error)
  }
}

// Run the regeneration
regenerate()
