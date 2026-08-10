import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import Loader from '../Loader/Loader.jsx'

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()

  if (loading) return <Loader />

  if (!user) {
    return <Navigate to={adminOnly ? '/admin/login' : '/login'} replace />
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
