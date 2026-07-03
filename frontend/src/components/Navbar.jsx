import { Link, useNavigate } from 'react-router-dom'
import { FiLogOut, FiUser, FiSettings } from 'react-icons/fi'
import useAuth from '../hooks/useAuth'
import { initials } from '../utils/helpers'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm px-3">
      <div className="container-fluid">
        <Link className="navbar-brand taskflow-brand fs-4" to={isAdmin ? '/admin' : '/dashboard'}>
          TaskFlow
        </Link>

        <div className="d-flex align-items-center gap-3 ms-auto">
          {isAdmin && (
            <span className="badge rounded-pill" style={{ backgroundColor: '#ffc107', color: '#212529' }}>
              Administrateur
            </span>
          )}

          <div className="dropdown">
            <button
              className="btn btn-light d-flex align-items-center gap-2 rounded-pill"
              type="button"
              data-bs-toggle="dropdown"
            >
              <span
                className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white"
                style={{ width: 32, height: 32, fontSize: '0.8rem', fontWeight: 600 }}
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="rounded-circle w-100 h-100" style={{ objectFit: 'cover' }} />
                ) : (
                  initials(user?.name)
                )}
              </span>
              <span className="d-none d-md-inline">{user?.name}</span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-sm">
              <li>
                <Link className="dropdown-item d-flex align-items-center gap-2" to="/profile">
                  <FiUser /> Mon profil
                </Link>
              </li>
              <li>
                <Link className="dropdown-item d-flex align-items-center gap-2" to="/settings">
                  <FiSettings /> Paramètres
                </Link>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item d-flex align-items-center gap-2 text-danger" onClick={handleLogout}>
                  <FiLogOut /> Déconnexion
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}
