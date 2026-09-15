import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api.js'

export default function SearchUsers() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return
    setError('')
    try {
      const res = await api.searchUsers(query.trim())
      setResults(res)
      setSearched(true)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="search-screen">
      <header className="wardrobe-header">
        <h1>Find people</h1>
        <Link to="/wardrobe" className="btn-ghost">Back</Link>
      </header>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by username…"
          autoFocus
        />
        <button className="btn-primary" type="submit">Search</button>
      </form>

      {error && <p className="form-error">{error}</p>}

      {searched && results.length === 0 && (
        <p className="hint">No users found matching "{query}".</p>
      )}

      <div className="search-results">
        {results.map((user) => (
          <button
            key={user.username}
            className="search-result-row"
            onClick={() => navigate(`/u/${user.username}`)}
          >
            <div>
              <strong>{user.name}</strong>
              <span className="hint"> @{user.username}</span>
            </div>
            {!user.publicProfile && <span className="badge-private">Private</span>}
          </button>
        ))}
      </div>
    </div>
  )
}
