import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Wardrobe from './pages/Wardrobe.jsx'
import AddItem from './pages/AddItem.jsx'
import SearchUsers from './pages/SearchUsers.jsx'
import PublicWardrobe from './pages/PublicWardrobe.jsx'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/wardrobe" element={<ProtectedRoute><Wardrobe /></ProtectedRoute>} />
          <Route path="/add-item" element={<ProtectedRoute><AddItem /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchUsers /></ProtectedRoute>} />
          <Route path="/u/:username" element={<ProtectedRoute><PublicWardrobe /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/wardrobe" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
