import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Wardrobe() {
  const { user, logout } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
        <button className="btn-ghost" onClick={logout}>Log out</button>
      </header>

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
