import { useEffect, useState } from 'react'
import CategoryService from '../services/CategoryService'

const emptyTask = {
  title: '',
  description: '',
  priority: 'moyenne',
  status: 'a_faire',
  deadline: '',
  category_id: '',
}

export default function TaskForm({ initialValues, onSubmit, submitLabel = 'Enregistrer', loading }) {
  const [form, setForm] = useState({ ...emptyTask, ...initialValues })
  const [errors, setErrors] = useState({})
  const [categories, setCategories] = useState([])

  useEffect(() => {
    CategoryService.list().then((res) => setCategories(res.data.data))
  }, [])

  useEffect(() => {
    if (initialValues) {
      setForm((prev) => ({ ...prev, ...initialValues }))
    }
  }, [initialValues])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    try {
      await onSubmit({
        ...form,
        category_id: form.category_id || null,
        deadline: form.deadline || null,
      })
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-3">
        <label className="form-label">Titre *</label>
        <input
          type="text"
          name="title"
          className={`form-control ${errors.title ? 'is-invalid' : ''}`}
          value={form.title}
          onChange={handleChange}
          required
        />
        {errors.title && <div className="invalid-feedback">{errors.title[0]}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          className="form-control"
          rows="4"
          value={form.description || ''}
          onChange={handleChange}
        />
      </div>

      <div className="row g-3">
        <div className="col-md-4">
          <label className="form-label">Priorité</label>
          <select name="priority" className="form-select" value={form.priority} onChange={handleChange}>
            <option value="basse">Basse</option>
            <option value="moyenne">Moyenne</option>
            <option value="haute">Haute</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Statut</label>
          <select name="status" className="form-select" value={form.status} onChange={handleChange}>
            <option value="a_faire">À faire</option>
            <option value="en_cours">En cours</option>
            <option value="terminee">Terminée</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Échéance</label>
          <input
            type="date"
            name="deadline"
            className="form-control"
            value={form.deadline || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="mb-3 mt-3">
        <label className="form-label">Catégorie</label>
        <select name="category_id" className="form-select" value={form.category_id || ''} onChange={handleChange}>
          <option value="">Aucune catégorie</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Enregistrement...' : submitLabel}
      </button>
    </form>
  )
}
