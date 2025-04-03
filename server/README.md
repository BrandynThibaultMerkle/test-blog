# Blog Manager Server

This is a simple Node.js server that helps non-technical team members create blog posts directly in the `/public/data/` directory.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or pnpm

### Starting the Server

#### Windows

Double-click the `start-blog-server.bat` file.

#### Mac/Linux

1. Make the script executable: `chmod +x start-blog-server.sh`
2. Run the script: `./start-blog-server.sh`

#### Manual Start

1. Navigate to this directory in your terminal
2. Run `npm install` to install dependencies
3. Run `npm start` to start the server

### How It Works

This local server provides the following functionality:

1. Reads and writes blog post JSON files directly to your project
2. Automatically paginates blog posts (10 posts per page)
3. Updates the blog metadata file
4. Creates new page files when needed
5. Generates static HTML files for SEO
6. Creates and maintains a sitemap.xml file

## For Non-Technical Users

1. Start the server using one of the methods above
2. Run the React app using `pnpm dev` (from the project root)
3. Navigate to the Blog Generator page
4. Fill in your blog post details
5. Click "Create Blog Post"
6. The post will be added directly to the appropriate JSON file
7. Commit your changes and create a pull request

## API Endpoints

- `GET /api/metadata` - Gets the current blog metadata
- `POST /api/posts` - Creates a new blog post
- `GET /api/generate-html` - Regenerates all static HTML files for SEO
- `GET /api/generate-sitemap` - Regenerates the sitemap.xml file

## SEO Features

### Static HTML Generation

The server automatically generates static HTML files for all blog posts in the `/public/blog/` directory. This improves search engine discoverability by providing:

- HTML files named using the post's slug (e.g., `getting-started-with-react.html`)
- Proper metadata and structured content
- Smart JavaScript redirect that only affects human visitors while allowing search engine bots to crawl the content

### Sitemap.xml Generation

The server creates a `sitemap.xml` file in the `/public/` directory to help search engines discover all content:

- Lists all blog pages and individual post pages
- Includes priority and change frequency information
- Gets regenerated when the server starts or when using the API endpoint
- Can be customized with a base URL parameter:
  `GET /api/generate-sitemap?baseUrl=https://yourdomain.com`

When adding new blog posts, both HTML files and the sitemap are automatically updated.
