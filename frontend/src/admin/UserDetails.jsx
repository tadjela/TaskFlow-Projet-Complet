import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import UserService from '../services/UserService'
import Loading from '../components/Loading'
import { initials, formatDate } from '../utils/helpers'
import { useToast } from '../context/ToastContext.jsx'

export default function UserDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadUser = () => {
    setLoading(true)
    UserService.get(id)
      .then((res) => setUser(res.data.data))
      .catch(() => {
        showToast('Utilisateur introuvable.', 'error')
        navigate('/admin/users')
      })
      .finally(() => setLoading(false))
  }

  useEffect(loadUser, [id])

  const toggleActive = async () => {
    try {
      await UserService.update(id, { is_active: !user.is_active })
      showToast(`Compte ${user.is_active ? 'désactivé' : 'activé'} avec succès.`)
      loadUser()
    } catch {
      showToast('Erreur lors de la modification du statut.', 'error')
    }
  }

  const toggleRole = async () => {
    try {
      await UserService.update(id, { role: user.role === 'admin' ? 'user' : 'admin' })
      showToast('Rôle mis à jour avec succès.')
      loadUser()
    } catch {
      showToast('Erreur lors de la modification du rôle.', 'error')
    }
  }

  if (loading) return <Loading />
  if (!user) return null

  return (
    <div className="container py-4">
      <button className="btn btn-link mb-3 ps-0 text-decoration-none" onClick={() => navigate('/admin/users')}>
        ← Retour à la liste
      </button>

      <div className="row g-4">
        {/* Colonne Profil */}
        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-body text-center d-flex flex-column justify-content-between">
              <div>
                <span
                  className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white fs-3 fw-bold mb-3"
                  style={{ width: 88, height: 88 }}
                >
                  {initials(user.name)}
                </span>
                <h4>{user.name}</h4>
                <p className="text-muted small mb-3">{user.email}</p>

                <div className="d-flex justify-content-center gap-2 mb-4">
                  <span className={`badge ${user.role === 'admin' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                    {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                  </span>
                  <span className={`badge ${user.is_active ? 'bg-success' : 'bg-danger'}`}>
                    {user.is_active ? 'Actif' : 'Désactivé'}
                  </span>
                </div>

                <div className="border-top pt-3 text-start">
                  <div className="mb-2">
                    <span className="text-muted small d-block">Inscrit le</span>
                    <span className="fw-semibold">{formatDate(user.created_at)}</span>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-column gap-2 mt-4">
                <button className="btn btn-outline-secondary w-100" onClick={toggleRole}>
                  Basculer le rôle
                </button>
                <button className="btn btn-outline-warning w-100" onClick={toggleActive}>
                  {user.is_active ? 'Désactiver le compte' : 'Activer le compte'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne Données et Activités */}
        <div className="col-lg-8">
          <div className="row g-4">
            
            {/* Statistiques des Tâches */}
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title mb-3">Données des tâches</h5>
                  <div className="row g-3 text-center">
                    <div className="col-md-4">
                      <div className="p-3 bg-light rounded">
                        <div className="text-muted small">Total créées</div>
                        <div className="fw-bold fs-4 text-primary">{user.tasks_count || 0}</div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="p-3 bg-light rounded">
                        <div className="text-muted small">En cours</div>
                        <div className="fw-bold fs-4 text-warning">{user.pending_tasks_count || 0}</div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="p-3 bg-light rounded">
                        <div className="text-muted small">Terminées</div>
                        <div className="fw-bold fs-4 text-success">{user.completed_tasks_count || 0}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Historique des Activités */}
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title mb-3">Activités récentes</h5>
                  {user.activities && user.activities.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0 small">
                        <thead className="table-light">
                          <tr>
                            <th>Action</th>
                            <th>Description</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {user.activities.map((activity) => (
                            <tr key={activity.id}>
                              <td>
                                <span className={`badge bg-opacity-10 text-${activity.type === 'auth' ? 'info' : 'primary'} bg-${activity.type === 'auth' ? 'info' : 'primary'}`}>
                                  {activity.action}
                                </span>
                              </td>
                              <td className="text-secondary">{activity.description}</td>
                              <td className="text-nowrap">{formatDate(activity.created_at)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted small text-center my-3">Aucune activité enregistrée pour le moment.</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}