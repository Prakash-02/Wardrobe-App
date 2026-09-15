import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Wardrobe() {
  const { user, logout, updateLocalUser } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [togglingVisibility, setTogglingVisibility] = useState(false)

  async function handleToggleVisibility() {
    setTogglingVisibility(true)
    try {
      const res = await api.setVisibility(!user.publicProfile)
      updateLocalUser({ publicProfile: res.publicProfile })
    } catch (err) {
      setError(err.message)
    } finally {
      setTogglingVisibility(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  async function loadItems() {
    setLoading(true)
    try {
      setItems(await api.listItems())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    await api.deleteItem(id)
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="wardrobe-screen">
      <header className="wardrobe-header">
        <div>
          <h1>{user?.name}'s wardrobe</h1>
          <p className="hint">{items.length} item{items.length === 1 ? '' : 's'}</p>
        </div>
        <div className="wardrobe-header-actions">
          <Link to="/search" className="btn-ghost">Find people</Link>
          <button className="btn-ghost" onClick={logout}>Log out</button>
        </div>
      </header>

      <div className="visibility-row">
        <div>
          <strong>{user?.publicProfile ? 'Your wardrobe is public' : 'Your wardrobe is private'}</strong>
          <p className="hint">
            {user?.publicProfile
              ? 'Anyone can search for your username and view this collection.'
              : 'Only you can see this collection.'}
          </p>
        </div>
        <button className="btn-ghost" onClick={handleToggleVisibility} disabled={togglingVisibility}>
          {togglingVisibility ? 'Updating…' : user?.publicProfile ? 'Make private' : 'Make public'}
        </button>
      </div>

      {error && <p className="form-error">{error}</p>}

      {loading ? (
        <p>Loading…</p>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <p>Nothing here yet. Capture your first piece to start your collection.</p>
        </div>
      ) : (
        <div className="wardrobe-grid">
          {items.map((item) => (
            <div key={item.id} className="wardrobe-card">
              <img src={item.imageUrl} alt={item.name} />
              <div className="wardrobe-card-info">
                <strong>{item.name}</strong>
                <span>{[item.category, item.color].filter(Boolean).join(' · ')}</span>
              </div>
              <button className="card-delete" onClick={() => handleDelete(item.id)} aria-label="Remove item">
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <Link to="/add-item" className="fab" aria-label="Add item">+</Link>
    </div>
  )
}
