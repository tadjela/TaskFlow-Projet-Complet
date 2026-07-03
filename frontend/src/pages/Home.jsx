import { Link } from 'react-router-dom'
import { FiCheckCircle, FiFolder, FiBarChart2 } from 'react-icons/fi'

export default function Home() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <nav className="navbar navbar-expand-lg bg-white border-bottom px-3">
        <div className="container">
          <span className="navbar-brand taskflow-brand fs-3">TaskFlow</span>
          <div className="d-flex gap-2">
            <Link to="/login" className="btn btn-outline-primary">Connexion</Link>
            <Link to="/register" className="btn btn-primary">Inscription</Link>
          </div>
        </div>
      </nav>

      <header className="text-white py-5" style={{ background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)' }}>
        <div className="container text-center py-5">
          <h1 className="display-5 fw-bold mb-3">Organisez vos tâches, simplement.</h1>
          <p className="lead mb-4">
            TaskFlow vous aide à créer, prioriser et suivre vos tâches quotidiennes,
            avec un tableau de bord clair et des catégories personnalisées.
          </p>
          <Link to="/register" className="btn btn-light btn-lg fw-bold text-primary">
            Commencer gratuitement
          </Link>
        </div>
      </header>

      <section className="container py-5 flex-grow-1">
        <div className="row g-4 text-center">
          <div className="col-md-4">
            <FiCheckCircle size={40} className="text-primary mb-3" />
            <h5>Gestion complète des tâches</h5>
            <p className="text-muted">Créez, priorisez, filtrez et suivez vos tâches en toute simplicité.</p>
          </div>
          <div className="col-md-4">
            <FiFolder size={40} className="text-success mb-3" />
            <h5>Catégories personnalisées</h5>
            <p className="text-muted">Organisez votre travail avec des catégories colorées sur-mesure.</p>
          </div>
          <div className="col-md-4">
            <FiBarChart2 size={40} className="text-warning mb-3" />
            <h5>Tableau de bord</h5>
            <p className="text-muted">Visualisez votre activité et suivez votre taux d'achèvement.</p>
          </div>
        </div>
      </section>

      <footer className="text-center text-muted py-3 border-top bg-white small">
        © {new Date().getFullYear()} TaskFlow — Application de gestion de tâches. Tous droits réservés.
      </footer>
    </div>
  )
}
