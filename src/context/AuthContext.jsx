import { createContext, useContext, useEffect, useState } from 'react'
import { api, setToken } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [checkingSession, setCheckingSession] = useState(true)

  // On reload: we keep whatever user info we last stored alongside the token.
  // (A production app would instead call GET /api/auth/me to re-validate the token.)
  useEffect(() => {
    const stored = localStorage.getItem('wardrobe_user')
    if (stored) setUser(JSON.parse(stored))
    setCheckingSession(false)
  }, [])

  function persist(authResponse) {
    setToken(authResponse.token)
    const userInfo = {
      id: authResponse.userId,
      name: authResponse.name,
      username: authResponse.username,
      email: authResponse.email,
      publicProfile: authResponse.publicProfile
    }
    localStorage.setItem('wardrobe_user', JSON.stringify(userInfo))
    setUser(userInfo)
  }

  async function signup(name, username, email, password) {
    const res = await api.signup(name, username, email, password)
    persist(res)
  }

  async function login(email, password) {
    const res = await api.login(email, password)
    persist(res)
  }

  // Called after toggling visibility so the header/toggle reflects reality
  // without needing a full re-login.
  function updateLocalUser(patch) {
    setUser((prev) => {
      const next = { ...prev, ...patch }
      localStorage.setItem('wardrobe_user', JSON.stringify(next))
      return next
    })
  }

  function logout() {
    setToken(null)
    localStorage.removeItem('wardrobe_user')
    setUser(null)
  }

  const value = { user, checkingSession, signup, login, logout, updateLocalUser }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
