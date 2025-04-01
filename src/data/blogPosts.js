export const blogPosts = [
  {
    id: 1,
    slug: 'getting-started-with-react',
    title: 'Getting Started with React',
    date: '2024-04-01',
    author: 'John Doe',
    excerpt:
      'Learn how to set up your first React project and understand the core concepts.',
    content: `
      React is a popular JavaScript library for building user interfaces, particularly single-page applications.

      Here are some key concepts to understand:

      1. Components: React applications are built using components. Components are reusable pieces of code that return React elements describing what should appear on the screen.

      2. JSX: JSX is a syntax extension for JavaScript that looks similar to HTML. It allows you to write HTML structures in the same file as JavaScript code.

      3. Props: Props are inputs to components. They allow you to pass data from a parent component to a child component.

      4. State: State is data that changes over time within a component.
    `,
  },
  {
    id: 2,
    slug: 'tailwind-css-tips',
    title: 'Tailwind CSS Tips and Tricks',
    date: '2024-04-02',
    author: 'Jane Smith',
    excerpt:
      'Discover useful tips and tricks for working with Tailwind CSS in your projects.',
    content: `
      Tailwind CSS is a utility-first CSS framework that allows you to build designs directly in your markup.

      Here are some tips for using Tailwind effectively:

      1. Use the @apply directive to extract repeated utility patterns into custom CSS classes.

      2. Take advantage of the responsive modifiers (sm:, md:, lg:, etc.) to create different layouts for different screen sizes.

      3. Use the group-hover and focus-within utilities for more complex hover states.

      4. Leverage the configuration file to customize colors, spacing, breakpoints, and more.
    `,
  },
  {
    id: 3,
    slug: 'file-based-blogging',
    title: 'The Benefits of File-Based Blogging',
    date: '2024-04-03',
    author: 'Alex Johnson',
    excerpt:
      'Why using a file-based approach for blogging might be the right choice for your team.',
    content: `
      File-based blogging offers several advantages for teams:

      1. Version Control: When blog posts are stored as files, they can be version-controlled with Git.

      2. No Database: Eliminating the database reduces complexity and potential points of failure.

      3. Simplified Backup: Backing up content is as simple as copying files.

      4. Developer-Friendly: Developers can use their familiar tools and workflows.

      5. Offline Editing: Content can be created and edited without an internet connection.

      6. Pull Request Workflow: Changes can be reviewed through pull requests before going live.
    `,
  },
]
