import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchPosts } from '../api/posts'
import Pagination from '../components/Pagination'
import type { Post } from '../types/post'

const LIMIT_OPTIONS = [10, 20, 50]
const DEFAULT_LIMIT = 10

function PostsPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Лимит и страница живут в URL (?page=2&limit=10), чтобы можно было обновить/поделиться ссылкой
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const limitFromUrl = Number(searchParams.get('limit')) || DEFAULT_LIMIT
  const limit = LIMIT_OPTIONS.includes(limitFromUrl) ? limitFromUrl : DEFAULT_LIMIT

  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    fetchPosts(page, limit)
      .then((result) => {
        if (cancelled) return
        setPosts(result.posts)
        setTotal(result.total)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [page, limit])

  const totalPages = Math.max(1, Math.ceil(total / limit))

  function updateParams(next: { page?: number; limit?: number }) {
    const nextPage = next.page ?? page
    const nextLimit = next.limit ?? limit
    setSearchParams({ page: String(nextPage), limit: String(nextLimit) })
  }

  return (
    <section className="posts-page">
      <header className="posts-header">
        <h1>Список постов</h1>
        <label className="limit-field">
          Постов на странице
          <select
            value={limit}
            onChange={(event) => {
              // Смена лимита сбрасывает на первую страницу
              updateParams({ page: 1, limit: Number(event.target.value) })
            }}
          >
            {LIMIT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </header>

      {loading && <p className="status">Загрузка…</p>}
      {error && <p className="status error">{error}</p>}

      {!loading && !error && (
        <>
          <ul className="post-list">
            {posts.map((post) => (
              <li key={post.id}>
                <Link to={`/posts/${post.id}`} className="post-card">
                  <span className="post-id">#{post.id}</span>
                  <h2>{post.title}</h2>
                  <p>{post.body}</p>
                </Link>
              </li>
            ))}
          </ul>

          <div className="posts-footer">
            <p className="muted">
              Страница {page} из {totalPages} · всего {total}
            </p>
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={(nextPage) => updateParams({ page: nextPage })}
            />
          </div>
        </>
      )}
    </section>
  )
}

export default PostsPage
