import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus } from 'react-icons/fi'
import TaskService from '../services/TaskService'
import CategoryService from '../services/CategoryService'
import TaskCard from '../components/TaskCard'
import SearchBar from '../components/SearchBar'
import Pagination from '../components/Pagination'
import ModalDelete from '../components/ModalDelete'
import Loading from '../components/Loading'
import { useToast } from '../context/ToastContext.jsx'

export default function Tasks() {
  const { showToast } = useToast()

  const [tasks, setTasks] = useState([])
  const [meta, setMeta] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    category_id: '',
    sort_by: 'created_at',
    sort_dir: 'desc',
    page: 1,
  })

  const loadTasks = useCallback(() => {
    setLoading(true)
    TaskService.list(filters)
      .then((res) => {
        setTasks(res.data.data)
        setMeta(res.data.meta)
      })
      .finally(() => setLoading(false))
  }, [filters])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  useEffect(() => {
    CategoryService.list().then((res) => setCategories(res.data.data))
  }, [])

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key === 'page' ? value : 1 }))
  }

  const handleStatusChange = async (id, status) => {
    try {
      await TaskService.updateStatus(id, status)
      showToast('Statut mis à jour.')
      loadTasks()
    } catch {
      showToast('Erreur lors de la mise à jour du statut.', 'error')
    }
  }

  const confirmDelete = async () => {
    if (!taskToDelete) return
    setDeleting(true)
    try {
      await TaskService.remove(taskToDelete.id)
      showToast('Tâche supprimée avec succès.')
      setTaskToDelete(null)
      loadTasks()
    } catch {
      showToast('Erreur lors de la suppression.', 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="fw-title mb-0">Mes tâches</h2>
        <Link to="/tasks/new" className="btn btn-primary d-flex align-items-center gap-2">
          <FiPlus /> Nouvelle tâche
        </Link>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-4">
              <SearchBar value={filters.search} onChange={(v) => updateFilter('search', v)} />
            </div>
            <div className="col-md-2">
              <select className="form-select" value={filters.status} onChange={(e) => updateFilter('status', e.target.value)}>
                <option value="">Tous les statuts</option>
                <option value="a_faire">À faire</option>
                <option value="en_cours">En cours</option>
                <option value="terminee">Terminée</option>
              </select>
            </div>
            <div className="col-md-2">
              <select className="form-select" value={filters.priority} onChange={(e) => updateFilter('priority', e.target.value)}>
                <option value="">Toute priorité</option>
                <option value="basse">Basse</option>
                <option value="moyenne">Moyenne</option>
                <option value="haute">Haute</option>
              </select>
            </div>
            <div className="col-md-2">
              <select className="form-select" value={filters.category_id} onChange={(e) => updateFilter('category_id', e.target.value)}>
                <option value="">Toute catégorie</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={`${filters.sort_by}:${filters.sort_dir}`}
                onChange={(e) => {
                  const [sort_by, sort_dir] = e.target.value.split(':')
                  setFilters((prev) => ({ ...prev, sort_by, sort_dir, page: 1 }))
                }}
              >
                <option value="created_at:desc">Plus récentes</option>
                <option value="deadline:asc">Échéance proche</option>
                <option value="priority:desc">Priorité</option>
                <option value="title:asc">Titre (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : tasks.length === 0 ? (
        <div className="text-center text-muted py-5">
          <p className="mb-3">Aucune tâche ne correspond à ces critères.</p>
          <Link to="/tasks/new" className="btn btn-primary">Créer une tâche</Link>
        </div>
      ) : (
        <>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={setTaskToDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
          <Pagination meta={meta} onPageChange={(page) => updateFilter('page', page)} />
        </>
      )}

      <ModalDelete
        show={!!taskToDelete}
        title="Supprimer la tâche"
        message={taskToDelete ? `Voulez-vous vraiment supprimer « ${taskToDelete.title} » ?` : ''}
        onConfirm={confirmDelete}
        onCancel={() => setTaskToDelete(null)}
        loading={deleting}
      />
    </div>
  )
}
