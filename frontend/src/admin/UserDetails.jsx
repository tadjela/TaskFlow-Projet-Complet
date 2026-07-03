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
    await UserService.update(id, { is_active: !user.is_active })
    showToast(`Compte ${user.is_active ? 'désactivé' : 'activé'} avec succès.`)
    loadUser()
  }

  const toggleRole = async () => {
    await UserService.update(id, { role: user.role === 'admin' ? 'user' : 'admin' })
    showToast('Rôle mis à jour avec succès.')
    loadUser()
  }

  if (loading) return <Loading />
  if (!user) return null

  return (
    <div className="row justify-content-center">
      <div className="col-lg-6">
        <button className="btn btn-link mb-3 ps-0" onClick={() => navigate('/admin/users')}>
          ← Retour à la liste
        </button>
        <div className="card">
          <div className="card-body text-center">
            <span
              className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white fs-3 fw-bold mb-3"
              style={{ width: 88, height: 88 }}
            >
              {initials(user.name)}
            </span>
            <h4>{user.name}</h4>
            <p className="text-muted">{user.email}</p>

            <div className="d-flex justify-content-center gap-2 mb-4">
              <span className={`badge ${user.role === 'admin' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
              </span>
              <span className={`badge ${user.is_active ? 'bg-success' : 'bg-danger'}`}>
                {user.is_active ? 'Actif' : 'Désactivé'}
              </span>
            </div>

            <div className="row text-start mb-4">
              <div className="col-6">
                <div className="text-muted small">Tâches créées</div>
                <div className="fw-bold fs-5">{user.tasks_count}</div>
              </div>
              <div className="col-6">
                <div className="text-muted small">Inscrit le</div>
                <div className="fw-bold">{formatDate(user.created_at)}</div>
              </div>
            </div>

            <div className="d-flex gap-2 justify-content-center">
              <button className="btn btn-outline-secondary" onClick={toggleRole}>
                Basculer le rôle
              </button>
              <button className="btn btn-outline-warning" onClick={toggleActive}>
                {user.is_active ? 'Désactiver le compte' : 'Activer le compte'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
