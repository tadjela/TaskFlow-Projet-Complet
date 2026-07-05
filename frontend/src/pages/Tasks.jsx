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
    <div className="container-fluid px-2 px-sm-3 overflow-hidden">
      
      {/* En-tête fluide mobile-first */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-3">
        <h2 className="fw-bold mb-0">Mes tâches</h2>
        <Link
          to="/tasks/new"
          className="btn btn-primary d-flex align-items-center justify-content-center gap-2 w-100 w-sm-auto flex-shrink-0"
        >
          <FiPlus /> Nouvelle tâche
        </Link>
      </div>

      {/* Barre de filtres adaptative */}
      <div className="card mb-4 w-100 shadow-sm">
        <div className="card-body px-2 px-sm-3">
          <div className="row g-2 align-items-center">

            {/* Recherche : Pleine largeur sur mobile, 1/3 sur grand écran */}
            <div className="col-12 col-lg-4">
              <SearchBar value={filters.search} onChange={(v) => updateFilter('search', v)} />
            </div>

            {/* Statuts : 2 par ligne sur petit mobile, 4 sur tablette */}
            <div className="col-6 col-sm-4 col-lg-2">
              <select
                className="form-select form-select-sm py-2"
                value={filters.status}
                onChange={(e) => updateFilter('status', e.target.value)}
              >
                <option value="">Tous les statuts</option>
                <option value="a_faire">À faire</option>
                <option value="en_cours">En cours</option>
                <option value="terminee">Terminée</option>
              </select>
            </div>

            {/* Priorité */}
            <div className="col-6 col-sm-4 col-lg-2">
              <select
                className="form-select form-select-sm py-2"
                value={filters.priority}
                onChange={(e) => updateFilter('priority', e.target.value)}
              >
                <option value="">Toute priorité</option>
                <option value="basse">Basse</option>
                <option value="moyenne">Moyenne</option>
                <option value="haute">Haute</option>
              </select>
            </div>

            {/* Catégorie */}
            <div className="col-6 col-sm-4 col-lg-2">
              <select
                className="form-select form-select-sm py-2"
                value={filters.category_id}
                onChange={(e) => updateFilter('category_id', e.target.value)}
              >
                <option value="">Toute catégorie</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Tri */}
            <div className="col-6 col-sm-12 col-lg-2">
              <select
                className="form-select form-select-sm py-2"
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

      {/* Section des tâches */}
      {loading ? (
        <Loading />
      ) : tasks.length === 0 ? (
        <div className="text-center text-muted py-5 px-3">
          <p className="mb-3">Aucune tâche ne correspond à ces critères.</p>
          <Link to="/tasks/new" className="btn btn-primary w-100 w-sm-auto">Créer une tâche</Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3 w-100">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={setTaskToDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
          <div className="d-flex justify-content-center mt-3 overflow-auto">
            <Pagination meta={meta} onPageChange={(page) => updateFilter('page', page)} />
          </div>
        </div>
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