import { NavLink, Outlet } from 'react-router-dom'
import { FiHome, FiUsers, FiBarChart2, FiFileText } from 'react-icons/fi'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const links = [
  { to: '/admin', label: 'Tableau de bord', icon: FiHome, end: true },
  { to: '/admin/users', label: 'Utilisateurs', icon: FiUsers },
  { to: '/admin/reports', label: 'Rapports', icon: FiBarChart2 },
  { to: '/admin/logs', label: 'Journal d\'activité', icon: FiFileText },
]

export default function AdminLayout() {
  return (
    <div className="d-flex flex-column min-vh-100 pb-5 pb-md-0">
      <Navbar />
      
      <div className="d-flex flex-grow-1">
        <aside className="sidebar p-3 d-none d-md-block border-end" style={{ width: 240 }}>
          <nav className="nav flex-column gap-1">
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded ${isActive ? 'bg-primary text-white active' : 'text-dark'}`}
              >
                <Icon /> {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-grow-1 p-3 p-md-4">
          <Outlet />
        </main>
      </div>

      <nav className="navbar navbar-light bg-white border-top fixed-bottom d-md-none py-2 px-1 shadow-sm">
        <div className="container-fluid justify-content-around">
          {links.map(({ to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `d-flex flex-column align-items-center text-decoration-none px-3 py-1 rounded-pill ${isActive ? 'text-primary bg-primary bg-opacity-10 fw-bold' : 'text-muted'}`}
            >
              <Icon size={22} />
            </NavLink>
          ))}
        </div>
      </nav>

      <Footer />
    </div>
  )
}