type PaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  limit: number
  limitOptions: number[]
  onLimitChange: (limit: number) => void
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

function Pagination({
  page,
  totalPages,
  onPageChange,
  limit,
  limitOptions,
  onLimitChange,
}: PaginationProps) {
  const pages = getVisiblePages(page, totalPages)

  return (
    <div className="pagination">
      <label className="pagination__limit">
        <span className="pagination__limit-text">Постов на странице</span>
        <select
          className="pagination__select"
          value={limit}
          onChange={(event) => {
            onLimitChange(Number(event.target.value))
          }}
        >
          {limitOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      {totalPages > 1 && (
        <div className="pagination__pages">
          <button
            className="pagination__button"
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Назад
          </button>

          {pages.map((item, index) =>
            item === '…' ? (
              <span key={`dots-${index}`} className="pagination__dots">
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                className={
                  item === page
                    ? 'pagination__button pagination__button_active'
                    : 'pagination__button'
                }
                onClick={() => onPageChange(item)}
              >
                {item}
              </button>
            ),
          )}

          <button
            className="pagination__button"
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Вперёд
          </button>
        </div>
      )}
    </div>
  )
}

export default Pagination
