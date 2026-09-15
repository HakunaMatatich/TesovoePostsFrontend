import type { Post, PostsPageResult } from '../types/post'

const API_URL = 'https://jsonplaceholder.typicode.com/posts'

/**
 * Список постов с серверной пагинацией.
 * JSONPlaceholder: _limit — сколько постов, _page — номер страницы (с 1).
 * Общее число приходит в заголовке X-Total-Count.
 */
export async function fetchPosts(
  page: number,
  limit: number,
): Promise<PostsPageResult> {
  const params = new URLSearchParams({
    _page: String(page),
    _limit: String(limit),
  })

  const response = await fetch(`${API_URL}?${params}`)

  if (!response.ok) {
    throw new Error(`Не удалось загрузить посты (${response.status})`)
  }

  const posts = (await response.json()) as Post[]
  const totalHeader = response.headers.get('X-Total-Count')
  const total = totalHeader ? Number(totalHeader) : posts.length

  return { posts, total }
}

/** Один пост по id, например /posts/5 */
export async function fetchPostById(id: string): Promise<Post> {
  const response = await fetch(`${API_URL}/${id}`)

  if (response.status === 404) {
    throw new Error('Пост не найден')
  }

  if (!response.ok) {
    throw new Error(`Не удалось загрузить пост (${response.status})`)
  }

  return (await response.json()) as Post
}
