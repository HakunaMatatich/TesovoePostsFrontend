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
