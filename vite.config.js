import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Camera access (getUserMedia) requires a "secure context":
// localhost is fine for dev; anything else needs HTTPS.
// When you deploy (Vercel/Netlify/Firebase Hosting) you get HTTPS automatically.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true // lets you open the dev server from your phone via your PC's LAN IP
  }
})
