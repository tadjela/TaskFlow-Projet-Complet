import { useEffect, useState } from 'react'
import UserService from '../services/UserService'
import Pagination from '../components/Pagination'
import Loading from '../components/Loading'

const actionLabels = {
  register: 'Inscription',
  login: 'Connexion',
  logout: 'Déconnexion',
  update_profile: 'Mise à jour du profil',
  update_password: 'Changement de mot de passe',
  create_task: 'Création de tâche',
  update_task: 'Modification de tâche',
  delete_task: 'Suppression de tâche',
  admin_update_user: 'Modification utilisateur (admin)',
  admin_delete_user: 'Suppression utilisateur (admin)',
}

export default function Logs() {
  const [logs, setLogs] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    setLoading(true)
    UserService.logs({ page })
      .then((res) => {
        setLogs(res.data.data)
        setMeta(res.data.meta)
      })
      .finally(() => setLoading(false))
  }, [page])

  return (
    <div>
      <h2 className="fw-title mb-4">Journal d'activité</h2>

      {loading ? (
        <Loading />
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Action</th>
                  <th>Détails</th>
                  <th>Adresse IP</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.user ? log.user.name : 'Utilisateur supprimé'}</td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {actionLabels[log.action] || log.action}
                      </span>
                    </td>
                    <td className="text-muted small">{log.description}</td>
                    <td className="text-muted small">{log.ip_address}</td>
                    <td className="text-muted small">
                      {new Date(log.created_at).toLocaleString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card-body">
            <Pagination meta={meta} onPageChange={setPage} />
          </div>
        </div>
      )}
    </div>
  )
}
