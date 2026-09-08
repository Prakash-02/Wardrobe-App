import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CameraCapture from '../components/CameraCapture.jsx'
import { removeBackground } from '../utils/removeBackground.js'
import { api } from '../api.js'

// Steps: camera -> processing (bg removal) -> review/edit details -> saved
export default function AddItem() {
  const navigate = useNavigate()
  const [step, setStep] = useState('camera')
  const [processedBlob, setProcessedBlob] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [color, setColor] = useState('')

  async function handleCapture(photoBlob) {
    setStep('processing')
    setError('')
    try {
      const cutoutBlob = await removeBackground(photoBlob, setProgress)
      setProcessedBlob(cutoutBlob)
      setPreviewUrl(URL.createObjectURL(cutoutBlob))
      setStep('review')
    } catch (err) {
      setError('Background removal failed: ' + err.message)
      setStep('camera')
    }
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await api.addItem({ name, category, color, imageBlob: processedBlob })
      navigate('/wardrobe')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="add-item-screen">
      <h1>Add to your wardrobe</h1>
      {error && <p className="form-error">{error}</p>}

      {step === 'camera' && (
        <CameraCapture onCapture={handleCapture} onCancel={() => navigate('/wardrobe')} />
      )}

      {step === 'processing' && (
        <div className="screen-center">
          <p>Removing the background… {progress}%</p>
          <p className="hint">First run downloads the on-device model (a few MB) — it's cached after that.</p>
        </div>
      )}

      {step === 'review' && (
        <form className="review-card" onSubmit={handleSave}>
          <img src={previewUrl} alt="Extracted garment" className="review-preview" />

          <label>Name
            <input value={name} onChange={(e) => setName(e.target.value)}
                   placeholder="e.g. Navy wrap dress" required />
          </label>
          <label>Category
            <input value={category} onChange={(e) => setCategory(e.target.value)}
                   placeholder="e.g. Dress" />
          </label>
          <label>Color
            <input value={color} onChange={(e) => setColor(e.target.value)}
                   placeholder="e.g. Navy" />
          </label>

          <div className="review-actions">
            <button type="button" className="btn-ghost" onClick={() => setStep('camera')}>
              Retake
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save to wardrobe'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
