import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center min-vh-100 px-3">
      <h1 className="display-1 fw-bold text-primary">404</h1>
      <p className="lead text-muted mb-4">Oups, cette page n'existe pas.</p>
      <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
    </div>
  )
}
