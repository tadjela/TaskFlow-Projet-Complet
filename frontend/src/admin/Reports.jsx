import { useEffect, useState } from 'react'
import { Doughnut, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'
import UserService from '../services/UserService'
import Loading from '../components/Loading'

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function Reports() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    UserService.statistics()
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading label="Chargement des rapports..." />
  if (!stats) return null

  const statusData = {
    labels: ['À faire', 'En cours', 'Terminées'],
    datasets: [
      {
        data: [
          stats.tasks_by_status.a_faire || 0,
          stats.tasks_by_status.en_cours || 0,
          stats.tasks_by_status.terminee || 0,
        ],
        backgroundColor: ['#6c757d', '#007bff', '#28a745'],
      },
    ],
  }

  const priorityData = {
    labels: ['Basse', 'Moyenne', 'Haute'],
    datasets: [
      {
        label: 'Tâches par priorité',
        data: [
          stats.tasks_by_priority.basse || 0,
          stats.tasks_by_priority.moyenne || 0,
          stats.tasks_by_priority.haute || 0,
        ],
        backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
        borderRadius: 6,
      },
    ],
  }

  return (
    <div>
      <h2 className="fw-title mb-1">Rapports et statistiques</h2>
      <p className="text-muted mb-4">Vue globale de l'activité sur la plateforme TaskFlow.</p>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="stat-card" style={{ backgroundColor: '#007bff' }}>
            <div className="fs-3 fw-bold">{stats.tasks.total}</div>
            <div className="small">Tâches totales</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card" style={{ backgroundColor: '#28a745' }}>
            <div className="fs-3 fw-bold">{stats.tasks.taux_achevement}%</div>
            <div className="small">Taux d'achèvement</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card" style={{ backgroundColor: '#dc3545' }}>
            <div className="fs-3 fw-bold">{stats.tasks.en_retard}</div>
            <div className="small">Tâches en retard</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card" style={{ backgroundColor: '#ffc107', color: '#212529' }}>
            <div className="fs-3 fw-bold">{stats.users.total}</div>
            <div className="small">Utilisateurs</div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="fw-title mb-3">Tâches par statut</h6>
              <Doughnut data={statusData} options={{ plugins: { legend: { position: 'bottom' } } }} />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="fw-title mb-3">Tâches par priorité</h6>
              <Bar
                data={priorityData}
                options={{
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
