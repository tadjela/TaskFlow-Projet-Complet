import { useState } from 'react'
import AuthService from '../services/AuthService'
import { useToast } from '../context/ToastContext.jsx'

export default function Settings() {
  const { showToast } = useToast()
  const [form, setForm] = useState({ current_password: '', password: '', password_confirmation: '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      await AuthService.updatePassword(form)
      showToast('Mot de passe modifié avec succès.')
      setForm({ current_password: '', password: '', password_confirmation: '' })
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      } else {
        showToast(err.response?.data?.message || 'Erreur lors du changement de mot de passe.', 'error')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-lg-6">
        <h2 className="fw-title mb-4">Paramètres du compte</h2>
        <div className="card">
          <div className="card-body">
            <h5 className="mb-3">Changer le mot de passe</h5>
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label">Mot de passe actuel</label>
                <input
                  type="password"
                  className={`form-control ${errors.current_password ? 'is-invalid' : ''}`}
                  value={form.current_password}
                  onChange={(e) => setForm({ ...form, current_password: e.target.value })}
                  required
                />
                {errors.current_password && <div className="invalid-feedback">{errors.current_password[0]}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Nouveau mot de passe</label>
                <input
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                {errors.password && <div className="invalid-feedback">{errors.password[0]}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Confirmer le nouveau mot de passe</label>
                <input
                  type="password"
                  className="form-control"
                  value={form.password_confirmation}
                  onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Modification...' : 'Modifier le mot de passe'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
