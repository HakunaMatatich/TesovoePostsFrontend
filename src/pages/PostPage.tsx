import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchPostById } from '../api/posts'
import type { Post } from '../types/post'

function PostPage() {
  const { id } = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    let cancelled = false
    setLoading(true)
    setError(null)

    fetchPostById(id)
      .then((data) => {
        if (!cancelled) setPost(data)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  return (
    <article className="post">
      <Link to="/" className="post__back">
        ← К списку
      </Link>

      {loading && <p className="post__status">Загрузка…</p>}
      {error && <p className="post__status post__status_error">{error}</p>}

      {post && (
        <>
          <p className="post__meta">
            Пост #{post.id} · пользователь {post.userId}
          </p>
          <h1 className="post__title">{post.title}</h1>
          <p className="post__body">{post.body}</p>
        </>
      )}
    </article>
  )
}

export default PostPage
