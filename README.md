# Test Blog with File-Based Content Management

A React and Tailwind CSS blog site using a file-based approach for content management. This allows non-technical team members to create blog posts locally, commit changes, and submit PRs.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- pnpm (version 7 or higher)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   pnpm install
   ```

### Running the Development Server

1. Start the React development server:
   ```
   pnpm dev
   ```
2. Open your browser and navigate to `http://localhost:5173`

## Blog Content Management

This project uses JSON files to store blog post data. Each blog page contains up to 10 posts.

### For Non-Technical Team Members

#### Creating Blog Posts

1. Navigate to the `server` directory
2. Run the appropriate startup script for your OS:
   - Windows: Double-click `start-blog-server.bat`
   - Mac/Linux: Run `./start-blog-server.sh` (make sure it's executable first with `chmod +x start-blog-server.sh`)
3. Open the React app in your browser
4. Click on "Create Post" in the header or "Create New Post" on the blog page
5. Fill in the blog post form and click "Create Blog Post"
6. The post will be automatically added to the appropriate JSON file

#### Submitting Your Changes

1. Commit the updated files (if using Git):
   ```
   git add public/data/
   git commit -m "Add new blog post: [Title]"
   git push
   ```
2. Create a pull request for review

### File Structure

- `/public/data/blog-metadata.json` - Contains pagination information
- `/public/data/blog-page-1.json` - First page of blog posts (up to 10)
- `/public/data/blog-page-2.json` - Second page of blog posts (up to 10)
- etc.

### Blog Post Format

Each blog post has the following structure:

```json
{
  "id": 1,
  "slug": "post-title-slug",
  "title": "Post Title",
  "date": "2024-04-01",
  "author": "Author Name",
  "excerpt": "Brief excerpt of the post",
  "content": {
    "paragraphs": [
      "First paragraph content",
      "Second paragraph content",
      "Third paragraph content"
    ]
  }
}
```

## SEO Enhancements

This blog includes SEO optimization features:

### Static HTML Generation

The system automatically generates static HTML files for all blog posts to improve search engine discoverability:

- Located in `/public/blog/` directory
- Generated when the server starts and when new posts are created
- Files are named using the post's slug (e.g., `getting-started-with-react.html`)
- Includes proper metadata and structured content for search engines
- Smart redirect for human visitors to the React app while allowing search engine bots to crawl

### Sitemap Generation

A sitemap.xml file is automatically generated to help search engines discover content:

- Located at `/public/sitemap.xml`
- Includes all blog pages and individual posts
- Regenerated when the server starts
- Can be manually regenerated via API endpoint

### Manual Regeneration

If needed, you can manually regenerate these files:

```
# Regenerate all HTML files
GET http://localhost:3001/api/generate-html

# Regenerate sitemap
GET http://localhost:3001/api/generate-sitemap

# Specify a custom base URL for the sitemap
GET http://localhost:3001/api/generate-sitemap?baseUrl=https://yourdomain.com
```

## Technical Details

- React 19 with Vite
- Tailwind CSS 4
- React Router DOM for navigation
- Express for the local blog management server

## Pages

- Home: Landing page
- Blog: Paginated list of blog posts
- Blog Post: Individual blog post page
- Blog Generator: Create new blog posts
