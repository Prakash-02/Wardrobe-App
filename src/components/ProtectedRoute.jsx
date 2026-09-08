import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { user, checkingSession } = useAuth()

  if (checkingSession) {
    return <div className="screen-center">Loading your wardrobe…</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
