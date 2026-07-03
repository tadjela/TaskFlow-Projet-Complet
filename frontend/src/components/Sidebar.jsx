import { NavLink } from 'react-router-dom'
import { FiHome, FiCheckSquare, FiFolder, FiUser } from 'react-icons/fi'

const links = [
  { to: '/dashboard', label: 'Tableau de bord', icon: FiHome },
  { to: '/tasks', label: 'Tâches', icon: FiCheckSquare },
  { to: '/categories', label: 'Catégories', icon: FiFolder },
  { to: '/profile', label: 'Profil', icon: FiUser },
]

export default function Sidebar() {
  return (
    <aside className="sidebar p-3 d-none d-md-block" style={{ width: 240 }}>
      <nav className="nav flex-column">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-link d-flex align-items-center gap-2 px-3 py-2 ${isActive ? 'active' : ''}`}
          >
            <Icon /> {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
