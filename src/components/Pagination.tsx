type PaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

function getVisiblePages(page: number, totalPages: number): Array<number | '…'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const items: Array<number | '…'> = [1]

  const start = Math.max(2, page - 1)
  const end = Math.min(totalPages - 1, page + 1)

  if (start > 2) {
    items.push('…')
  }

  for (let n = start; n <= end; n += 1) {
    items.push(n)
  }

  if (end < totalPages - 1) {
    items.push('…')
  }

  items.push(totalPages)
  return items
}


/** Простая пагинация: назад / вперёд и номера страниц вокруг текущей */
function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const pages = getVisiblePages(page, totalPages)

  return (
    <nav className="pagination" aria-label="Страницы постов">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Назад
      </button>

      {pages.map((item, index) =>
        item === '…' ? (
          <span key={`dots-${index}`} className="pagination-dots">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={item === page ? 'is-active' : undefined}
            onClick={() => onPageChange(item)}
            aria-current={item === page ? 'page' : undefined}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Вперёд
      </button>
    </nav>
  )
}



export default Pagination
