import { Link, Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className='min-h-screen w-screen bg-gray-900 text-white'>
      <header className='bg-gray-800 p-4 shadow-md'>
        <div className='container mx-auto flex justify-between items-center'>
          <div className='text-xl font-bold'>Test Marketing Site</div>
          <nav>
            <ul className='flex space-x-6'>
              <li>
                <Link to='/' className='hover:text-blue-400 transition-colors'>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to='/blog'
                  className='hover:text-blue-400 transition-colors'>
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to='/blog/generator'
                  className='hover:text-blue-400 transition-colors'>
                  Create Post
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className='container mx-auto p-4'>
        <Outlet />
      </main>
      <footer className='bg-gray-800 p-4 mt-auto'>
        <div className='container mx-auto text-center text-gray-400'>
          © {new Date().getFullYear()} Test Marketing Site. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default Layout
