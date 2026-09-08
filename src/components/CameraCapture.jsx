import { useEffect, useRef, useState } from 'react'

/**
 * Opens the device camera (back camera by default) and lets the user
 * snap a photo. Calls onCapture(blob) with a JPEG blob when they confirm.
 */
export default function CameraCapture({ onCapture, onCancel }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const [stillFrame, setStillFrame] = useState(null) // dataURL preview after snapping
  const [error, setError] = useState(null)

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [])

  async function startCamera() {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } }, // back camera on phones
        audio: false
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
    } catch (err) {
      setError(
        'Could not access the camera. Check that you allowed camera permission, ' +
          'and that the page is served over HTTPS (or localhost).'
      )
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop())
  }

  function snapPhoto() {
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    setStillFrame(canvas.toDataURL('image/jpeg', 0.92))
    stopCamera()
  }

  function retake() {
    setStillFrame(null)
    startCamera()
  }

  function confirm() {
    canvasRef.current.toBlob(
      (blob) => onCapture(blob),
      'image/jpeg',
      0.92
    )
  }

  return (
    <div className="camera-wrap">
      {error && <p className="camera-error">{error}</p>}

      {!stillFrame && !error && (
        <video ref={videoRef} className="camera-video" playsInline muted />
      )}

      {stillFrame && (
        <img src={stillFrame} alt="Captured item" className="camera-video" />
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="camera-controls">
        {!stillFrame ? (
          <>
            <button className="btn-ghost" onClick={onCancel}>Cancel</button>
            <button className="btn-shutter" onClick={snapPhoto} disabled={!!error}>
              Capture
            </button>
          </>
        ) : (
          <>
            <button className="btn-ghost" onClick={retake}>Retake</button>
            <button className="btn-primary" onClick={confirm}>Use photo</button>
          </>
        )}
      </div>
    </div>
  )
}
