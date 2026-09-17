import { Link, Route, Routes } from 'react-router-dom'
import PostsPage from './pages/PostsPage'
import PostPage from './pages/PostPage'
import './App.css'

function App() {
  return (
    <div className="layout">
      <nav className="layout__nav">
        <Link className="layout__nav-link" to="/">
          Посты
        </Link>
      </nav>

      <main className="layout__main">
        <Routes>
          <Route path="/" element={<PostsPage />} />
          <Route path="/posts/:id" element={<PostPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
