import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Loading from './Loading'

export default function AdminRoute() {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) return <Loading label="Vérification des droits..." />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/dashboard" replace />

  return <Outlet />
}
