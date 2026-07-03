import { useState } from 'react'
import AuthService from '../services/AuthService'
import useAuth from '../hooks/useAuth'
import { useToast } from '../context/ToastContext.jsx'
import { initials } from '../utils/helpers'

export default function Profile() {
  const { user, setUser } = useAuth()
  const { showToast } = useToast()

  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' })
  const [avatarFile, setAvatarFile] = useState(null)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      let payload = form
      if (avatarFile) {
        payload = new FormData()
        payload.append('name', form.name)
        payload.append('email', form.email)
        payload.append('avatar', avatarFile)
      }
      const { data } = await AuthService.updateProfile(payload)
      setUser(data.user)
      showToast('Profil mis à jour avec succès.')
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      } else {
        showToast('Erreur lors de la mise à jour du profil.', 'error')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-lg-6">
        <h2 className="fw-title mb-4">Mon profil</h2>
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center gap-3 mb-4">
              <span
                className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white fs-4 fw-bold"
                style={{ width: 72, height: 72, overflow: 'hidden' }}
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                ) : (
                  initials(user?.name)
                )}
              </span>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control form-control-sm"
                  onChange={(e) => setAvatarFile(e.target.files[0])}
                />
                <div className="form-text">Formats acceptés : JPG, PNG (2 Mo max).</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label">Nom complet</label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                {errors.name && <div className="invalid-feedback">{errors.name[0]}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Adresse e-mail</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                {errors.email && <div className="invalid-feedback">{errors.email[0]}</div>}
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
