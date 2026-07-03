export default function Loading({ label = 'Chargement...' }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 text-primary">
      <div className="spinner-border" role="status" style={{ width: '2.5rem', height: '2.5rem' }}>
        <span className="visually-hidden">{label}</span>
      </div>
      <p className="mt-2 text-muted">{label}</p>
    </div>
  )
}
