import { removeBackground as imglyRemoveBackground } from '@imgly/background-removal'

/**
 * Runs an on-device segmentation model (downloaded once, then cached)
 * entirely in the browser via WASM — no server, no API key.
 * Takes a JPEG/PNG blob of the captured photo, returns a PNG blob
 * with the background made transparent, isolating the garment.
 */
export async function removeBackground(imageBlob, onProgress) {
  const resultBlob = await imglyRemoveBackground(imageBlob, {
    progress: (key, current, total) => {
      if (onProgress) onProgress(Math.round((current / total) * 100), key)
    }
  })
  return resultBlob // PNG blob, transparent background
}
