import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import UserService from '../services/UserService'
import SearchBar from '../components/SearchBar'
import Pagination from '../components/Pagination'
import ModalDelete from '../components/ModalDelete'
import Loading from '../components/Loading'
import { useToast } from '../context/ToastContext.jsx'
import useAuth from '../hooks/useAuth'

export default function Users() {
  const { showToast } = useToast()
  const { user: currentUser } = useAuth()

  const [users, setUsers] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', role: '', page: 1 })
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const loadUsers = useCallback(() => {
    setLoading(true)
    UserService.list(filters)
      .then((res) => {
        setUsers(res.data.data)
        setMeta(res.data.meta)
      })
      .finally(() => setLoading(false))
  }, [filters])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const toggleActive = async (u) => {
    try {
      await UserService.update(u.id, { is_active: !u.is_active })
      showToast(`Compte ${u.is_active ? 'désactivé' : 'activé'} avec succès.`)
      loadUsers()
    } catch {
      showToast('Erreur lors de la mise à jour.', 'error')
    }
  }

  const toggleRole = async (u) => {
    try {
      await UserService.update(u.id, { role: u.role === 'admin' ? 'user' : 'admin' })
      showToast('Rôle mis à jour avec succès.')
      loadUsers()
    } catch {
      showToast('Erreur lors de la mise à jour du rôle.', 'error')
    }
  }

  const confirmDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    try {
      await UserService.remove(toDelete.id)
      showToast('Utilisateur supprimé avec succès.')
      setToDelete(null)
      loadUsers()
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur lors de la suppression.', 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <h2 className="fw-title mb-4">Gestion des utilisateurs</h2>

      <div className="card mb-4">
        <div className="card-body row g-2">
          <div className="col-md-6">
            <SearchBar
              value={filters.search}
              onChange={(v) => setFilters((p) => ({ ...p, search: v, page: 1 }))}
              placeholder="Rechercher un utilisateur..."
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={filters.role}
              onChange={(e) => setFilters((p) => ({ ...p, role: e.target.value, page: 1 }))}
            >
              <option value="">Tous les rôles</option>
              <option value="user">Utilisateur</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>E-mail</th>
                  <th>Rôle</th>
                  <th>Tâches</th>
                  <th>Statut</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <Link to={`/admin/users/${u.id}`} className="text-decoration-none fw-medium">
                        {u.name}
                      </Link>
                    </td>
                    <td className="text-muted">{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                        {u.role === 'admin' ? 'Admin' : 'Utilisateur'}
                      </span>
                    </td>
                    <td>{u.tasks_count}</td>
                    <td>
                      <span className={`badge ${u.is_active ? 'bg-success' : 'bg-danger'}`}>
                        {u.is_active ? 'Actif' : 'Désactivé'}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-secondary" onClick={() => toggleRole(u)} disabled={u.id === currentUser.id}>
                          Rôle
                        </button>
                        <button className="btn btn-outline-warning" onClick={() => toggleActive(u)} disabled={u.id === currentUser.id}>
                          {u.is_active ? 'Désactiver' : 'Activer'}
                        </button>
                        <button className="btn btn-outline-danger" onClick={() => setToDelete(u)} disabled={u.id === currentUser.id}>
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card-body">
            <Pagination meta={meta} onPageChange={(page) => setFilters((p) => ({ ...p, page }))} />
          </div>
        </div>
      )}

      <ModalDelete
        show={!!toDelete}
        title="Supprimer l'utilisateur"
        message={toDelete ? `Voulez-vous vraiment supprimer le compte de « ${toDelete.name} » ?` : ''}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
        loading={deleting}
      />
    </div>
  )
}
