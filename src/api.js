// Set VITE_API_BASE in Vercel's project settings once the backend is deployed.
// Locally, create a .env.local file with: VITE_API_BASE=http://localhost:8083
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8083'

function getToken() {
  return localStorage.getItem('wardrobe_token')
}

export function setToken(token) {
  if (token) localStorage.setItem('wardrobe_token', token)
  else localStorage.removeItem('wardrobe_token')
}

async function handle(response) {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.message || `Request failed (${response.status})`)
  }
  return response.status === 204 ? null : response.json()
}

export const api = {
  signup(name, email, password) {
    return fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    }).then(handle)
  },

  login(email, password) {
    return fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }).then(handle)
  },

  listItems() {
    return fetch(`${API_BASE}/api/wardrobe/items`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    }).then(handle)
  },

  addItem({ name, category, color, imageBlob }) {
    const form = new FormData()
    form.append('name', name)
    if (category) form.append('category', category)
    if (color) form.append('color', color)
    form.append('image', imageBlob, 'garment.png')

    return fetch(`${API_BASE}/api/wardrobe/items`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: form
    }).then(handle)
  },

  deleteItem(id) {
    return fetch(`${API_BASE}/api/wardrobe/items/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` }
    }).then(handle)
  }
}
