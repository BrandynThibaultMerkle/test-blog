# Static Blog Pages for SEO

This directory contains static HTML files generated from the blog posts stored in the `/public/data/` directory. These files are meant for search engine crawlers and are not designed to be accessed directly by users.

## Purpose

The generated HTML files serve several purposes:

1. **Improved SEO**: Search engines can index these static HTML files, which contain the full content of each blog post.
2. **Faster Indexing**: Static HTML is easier for search engine crawlers to process than JavaScript-rendered content.
3. **Better Content Discoverability**: Helps search engines understand the structure and content of your blog.

## How It Works

The static HTML generation process works as follows:

1. When the blog server starts, it automatically generates HTML files for all existing blog posts.
2. When a new blog post is created, an HTML file is generated for that post.
3. Each HTML file includes metadata (title, description, author) and the full content of the post.
4. HTML files are named using the blog post's slug (e.g., `getting-started-with-react.html`).
5. A script in the HTML file redirects human visitors to the React app while allowing search engine bots to crawl the content.

## Manual Regeneration

If you need to regenerate all the HTML files, you can use the following API endpoint:

```
GET http://localhost:3001/api/generate-html
```

This will regenerate HTML files for all blog posts in the system.

## Sitemap

The system also generates a `sitemap.xml` file in the root of the public directory, which helps search engines discover all pages and blog posts. The sitemap is regenerated whenever the server starts or when you call:

```
GET http://localhost:3001/api/generate-sitemap
```

You can specify a custom base URL by adding a query parameter:

```
GET http://localhost:3001/api/generate-sitemap?baseUrl=https://yourdomain.com
```

## Styling

The static HTML files use a basic CSS stylesheet located at `/assets/css/style.css` to ensure proper formatting for search engines and screen readers.
