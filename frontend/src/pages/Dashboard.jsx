import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiClock } from 'react-icons/fi'
import DashboardService from '../services/DashboardService'
import Loading from '../components/Loading'
import Statistics from '../components/Statistics'
import { formatDate, priorityLabel } from '../utils/helpers'
import useAuth from '../hooks/useAuth'

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    DashboardService.get()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading label="Chargement du tableau de bord..." />
  if (!data) return null

  const { stats, by_priority: byPriority } = data
  const upcoming = data.upcoming_tasks?.data || data.upcoming_tasks || []

  const cards = [
    { label: 'Total des tâches', value: stats.total, color: '#007bff' },
    { label: 'À faire', value: stats.a_faire, color: '#6c757d' },
    { label: 'En cours', value: stats.en_cours, color: '#ffc107' },
    { label: 'Terminées', value: stats.terminee, color: '#28a745' },
    { label: 'En retard', value: stats.en_retard, color: '#dc3545' },
  ]

  return (
    <div>
      <h2 className="fw-title mb-1">Bonjour {user?.name?.split(' ')[0]} 👋</h2>
      <p className="text-muted mb-4">Voici un aperçu de votre activité.</p>

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

      <div className="row g-4">
        <div className="col-lg-8">
          <Statistics stats={stats} byPriority={byPriority} />
        </div>
        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="fw-title mb-3">Échéances à venir</h6>
              {upcoming.length === 0 && <p className="text-muted small mb-0">Aucune échéance proche.</p>}
              {upcoming.map((task) => (
                <div key={task.id} className="d-flex justify-content-between align-items-center border-bottom py-2">
                  <div>
                    <Link to={`/tasks/${task.id}/edit`} className="text-decoration-none fw-medium">
                      {task.title}
                    </Link>
                    <div className={`small priority-${task.priority}`}>{priorityLabel(task.priority)}</div>
                  </div>
                  <span className="small text-muted d-flex align-items-center gap-1">
                    <FiClock /> {formatDate(task.deadline)}
                  </span>
                </div>
              ))}
              <Link to="/tasks" className="btn btn-outline-primary btn-sm w-100 mt-3">
                Voir toutes les tâches
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
