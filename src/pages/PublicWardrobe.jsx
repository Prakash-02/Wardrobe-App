import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api.js'

export default function PublicWardrobe() {
  const { username } = useParams()
  const [items, setItems] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setError('')
    api.getUserWardrobe(username)
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [username])

  return (
    <div className="wardrobe-screen">
      <header className="wardrobe-header">
        <div>
          <h1>@{username}'s wardrobe</h1>
        </div>
        <Link to="/search" className="btn-ghost">Back to search</Link>
      </header>

      {loading && <p>Loading…</p>}

      {!loading && error && (
        <div className="empty-state">
          <p>{error.includes('private') ? 'This wardrobe is private.' : error}</p>
        </div>
      )}

      {!loading && items && items.length === 0 && (
        <div className="empty-state">
          <p>@{username} hasn't added anything yet.</p>
        </div>
      )}

      {!loading && items && items.length > 0 && (
        <div className="wardrobe-grid">
          {items.map((item) => (
            <div key={item.id} className="wardrobe-card">
              <img src={item.imageUrl} alt={item.name} />
              <div className="wardrobe-card-info">
                <strong>{item.name}</strong>
                <span>{[item.category, item.color].filter(Boolean).join(' · ')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
