import { createElement as h, useEffect } from 'react'
import { useKoperasiStore } from '@/store/useKoperasiStore'

const POLL_INTERVAL_MS = 3000

export function DocumentWatcher() {
  const checkDocumentStatusUpdates = useKoperasiStore(
    (state) => state.checkDocumentStatusUpdates,
  )

  useEffect(() => {
    void checkDocumentStatusUpdates()
    const interval = setInterval(
      () => void checkDocumentStatusUpdates(),
      POLL_INTERVAL_MS,
    )
    return () => clearInterval(interval)
  }, [checkDocumentStatusUpdates])

  return null
}