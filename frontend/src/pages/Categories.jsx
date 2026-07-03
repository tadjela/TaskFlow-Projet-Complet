import { useEffect, useState } from 'react'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import CategoryService from '../services/CategoryService'
import ModalDelete from '../components/ModalDelete'
import Loading from '../components/Loading'
import { useToast } from '../context/ToastContext.jsx'

const emptyForm = { name: '', color: '#007BFF' }

export default function Categories() {
  const { showToast } = useToast()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const loadCategories = () => {
    setLoading(true)
    CategoryService.list()
      .then((res) => setCategories(res.data.data))
      .finally(() => setLoading(false))
  }

  useEffect(loadCategories, [])

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setErrors({})
  }

  const handleEdit = (category) => {
    setForm({ name: category.name, color: category.color })
    setEditingId(category.id)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      if (editingId) {
        await CategoryService.update(editingId, form)
        showToast('Catégorie modifiée avec succès.')
      } else {
        await CategoryService.create(form)
        showToast('Catégorie créée avec succès.')
      }
      resetForm()
      loadCategories()
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      } else {
        showToast("Erreur lors de l'enregistrement.", 'error')
      }
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    try {
      await CategoryService.remove(toDelete.id)
      showToast('Catégorie supprimée avec succès.')
      setToDelete(null)
      loadCategories()
    } catch {
      showToast('Erreur lors de la suppression.', 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="row g-4">
      <div className="col-lg-4">
        <div className="card">
          <div className="card-body">
            <h5 className="fw-title mb-3">{editingId ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h5>
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label">Nom</label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                {errors.name && <div className="invalid-feedback">{errors.name[0]}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Couleur</label>
                <input
                  type="color"
                  className="form-control form-control-color w-100"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary flex-grow-1 d-flex align-items-center justify-content-center gap-2" disabled={saving}>
                  <FiPlus /> {saving ? 'Enregistrement...' : editingId ? 'Modifier' : 'Ajouter'}
                </button>
                {editingId && (
                  <button type="button" className="btn btn-light" onClick={resetForm}>
                    Annuler
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="col-lg-8">
        <h2 className="fw-title mb-4">Mes catégories</h2>
        {loading ? (
          <Loading />
        ) : categories.length === 0 ? (
          <p className="text-muted">Aucune catégorie pour le moment.</p>
        ) : (
          <div className="row g-3">
            {categories.map((category) => (
              <div className="col-md-6" key={category.id}>
                <div className="card">
                  <div className="card-body d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                      <span
                        className="rounded-circle d-inline-block"
                        style={{ width: 16, height: 16, backgroundColor: category.color }}
                      />
                      <div>
                        <div className="fw-medium">{category.name}</div>
                        <div className="small text-muted">{category.tasks_count} tâche(s)</div>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(category)}>
                        <FiEdit2 />
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => setToDelete(category)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ModalDelete
        show={!!toDelete}
        title="Supprimer la catégorie"
        message={toDelete ? `Voulez-vous vraiment supprimer « ${toDelete.name} » ? Les tâches associées ne seront plus catégorisées.` : ''}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
        loading={deleting}
      />
    </div>
  )
}
