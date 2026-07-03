import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import UserService from '../services/UserService'
import Loading from '../components/Loading'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    UserService.statistics()
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading label="Chargement des statistiques..." />
  if (!stats) return null

  const cards = [
    { label: 'Utilisateurs', value: stats.users.total, color: '#007bff' },
    { label: 'Comptes actifs', value: stats.users.actifs, color: '#28a745' },
    { label: 'Administrateurs', value: stats.users.admins, color: '#ffc107' },
    { label: 'Tâches totales', value: stats.tasks.total, color: '#6c757d' },
    { label: 'Tâches en retard', value: stats.tasks.en_retard, color: '#dc3545' },
  ]

  return (
    <div>
      <h2 className="fw-title mb-1">Tableau de bord administrateur</h2>
      <p className="text-muted mb-4">Vue d'ensemble de la plateforme TaskFlow.</p>

      <div className="row g-3 mb-4">
        {cards.map((card) => (
          <div className="col-6 col-md-4 col-lg" key={card.label}>
            <div className="stat-card" style={{ backgroundColor: card.color }}>
              <div className="fs-3 fw-bold">{card.value}</div>
              <div className="small">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-title mb-0">Utilisateurs les plus actifs</h6>
            <Link to="/admin/users" className="btn btn-sm btn-outline-primary">Voir tous les utilisateurs</Link>
          </div>
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Nom</th>
                <th>E-mail</th>
                <th className="text-end">Tâches</th>
              </tr>
            </thead>
            <tbody>
              {stats.top_users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td className="text-muted">{u.email}</td>
                  <td className="text-end">{u.tasks_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
