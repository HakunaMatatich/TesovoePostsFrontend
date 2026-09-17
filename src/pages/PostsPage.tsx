import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchPosts } from '../api/posts'
import Pagination from '../components/Pagination'
import type { Post } from '../types/post'

const LIMIT_OPTIONS = [10, 20, 50]
const DEFAULT_LIMIT = 10

function PostsPage() {
  const [searchParams, setSearchParams] = useSearchParams()

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
    <section className="posts">
      <header className="posts__header">
        <h1 className="posts__title">Список постов</h1>
      </header>

      {loading && <p className="posts__status">Загрузка…</p>}
      {error && <p className="posts__status posts__status_error">{error}</p>}

      {!loading && !error && (
        <>
          <ul className="posts__list">
            {posts.map((post) => (
              <li key={post.id} className="posts__item">
                <Link to={`/posts/${post.id}`} className="post-card">
                  <span className="post-card__id">#{post.id}</span>
                  <h2 className="post-card__title">{post.title}</h2>
                  <p className="post-card__text">{post.body}</p>
                </Link>
              </li>
            ))}
          </ul>

          <div className="posts__footer">
            <p className="posts__meta">
              Страница {page} из {totalPages} · всего {total}
            </p>
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={(nextPage) => updateParams({ page: nextPage })}
              limit={limit}
              limitOptions={LIMIT_OPTIONS}
              onLimitChange={(nextLimit) => updateParams({ page: 1, limit: nextLimit })}
            />
          </div>
        </>
      )}
    </section>
  )
}

export default PostsPage
