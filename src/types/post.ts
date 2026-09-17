/** Пост из JSONPlaceholder: /posts */
export type Post = {
  userId: number
  id: number
  title: string
  body: string
}

/** Ответ списка: посты текущей страницы + общее число (заголовок X-Total-Count) */
export type PostsPageResult = {
  posts: Post[]
  total: number
}

export function isPost(value: unknown): value is Post {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  return (
    'userId' in value &&
    'id' in value &&
    'title' in value &&
    'body' in value &&
    typeof value.userId === 'number' &&
    typeof value.id === 'number' &&
    typeof value.title === 'string' &&
    typeof value.body === 'string'
  )
}

export function isPostList(value: unknown): value is Post[] {
  return Array.isArray(value) && value.every(isPost)
}
