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

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function Statistics({ stats, byPriority }) {
  const statusData = {
    labels: ['À faire', 'En cours', 'Terminées'],
    datasets: [
      {
        data: [stats.a_faire, stats.en_cours, stats.terminee],
        backgroundColor: ['#6c757d', '#007bff', '#28a745'],
        borderWidth: 0,
      },
    ],
  }

  const priorityData = {
    labels: ['Basse', 'Moyenne', 'Haute'],
    datasets: [
      {
        label: 'Tâches par priorité',
        data: [byPriority.basse, byPriority.moyenne, byPriority.haute],
        backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
        borderRadius: 6,
      },
    ],
  }

  return (
    <div className="row g-4">
      <div className="col-md-6">
        <div className="card h-100">
          <div className="card-body">
            <h6 className="fw-title mb-3">Répartition par statut</h6>
            <Doughnut data={statusData} options={{ plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card h-100">
          <div className="card-body">
            <h6 className="fw-title mb-3">Répartition par priorité</h6>
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
  )
}
