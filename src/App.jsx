import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import BlogGenerator from './pages/BlogGenerator'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />

          <Route path='blog'>
            <Route index element={<Navigate to='/blog/page/1' replace />} />
            <Route path='page/:page' element={<Blog />} />
            <Route path='post/:slug' element={<BlogPost />} />
            <Route path='generator' element={<BlogGenerator />} />
          </Route>

          <Route path='blog/:slug' element={<BlogPost />} />

          <Route
            path='*'
            element={
              <div className='text-center py-16'>
                <h1 className='text-3xl font-bold mb-6'>Page Not Found</h1>
                <p className='text-xl text-gray-300 mb-8'>
                  Sorry, the page you are looking for does not exist.
                </p>
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
