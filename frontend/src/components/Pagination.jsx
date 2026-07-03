export default function Pagination({ meta, onPageChange }) {
  if (!meta || meta.last_page <= 1) return null

  const pages = Array.from({ length: meta.last_page }, (_, i) => i + 1)

  return (
    <nav aria-label="Pagination des tâches">
      <ul className="pagination justify-content-center mt-3">
        <li className={`page-item ${meta.current_page === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(meta.current_page - 1)}>
            Précédent
          </button>
        </li>
        {pages.map((page) => (
          <li key={page} className={`page-item ${page === meta.current_page ? 'active' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(page)}>
              {page}
            </button>
          </li>
        ))}
        <li className={`page-item ${meta.current_page === meta.last_page ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(meta.current_page + 1)}>
            Suivant
          </button>
        </li>
      </ul>
    </nav>
  )
}
