import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { useToast } from '../context/ToastContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      const data = await login(form)
      showToast(`Bienvenue ${data.user.name} !`)
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      } else {
        showToast(err.response?.data?.message || 'Erreur de connexion.', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="card auth-card shadow-lg p-4">
        <div className="card-body">
          <h2 className="text-center taskflow-brand mb-1">TaskFlow</h2>
          <p className="text-center text-muted mb-4">Connectez-vous à votre compte</p>
                              
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label">Adresse e-mail</label>
              <input
                type="email"
                name="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                value={form.email}
                onChange={handleChange}
                required
              />
              {errors.email && <div className="invalid-feedback">{errors.email[0]}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Mot de passe</label>
              <input
                type="password"
                name="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                value={form.password}
                onChange={handleChange}
                required
              />
              {errors.password && <div className="invalid-feedback">{errors.password[0]}</div>}
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="text-center text-muted mt-4 mb-0">
            Pas encore de compte ? <Link to="/register">Inscrivez-vous</Link>
          </p> 
              <div className="d-flex justify-content-center mt-4 mb-4">
                <button 
                  type="button" 
                  onClick={() => navigate('/')} 
                  className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-2"
                >
                  <svg xmlns="http://w3.org" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                  </svg>
                  <span>Retour</span>
                </button>
              </div>  
        </div>
      </div>
    </div>
  )
}
