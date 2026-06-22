import { createElement as h, useEffect } from 'react'
import { useDocumentStore } from '@/features/documents/store/useDocumentStore'

const POLL_INTERVAL_MS = 3000

export function DocumentWatcher() {
  const hasPendingDocuments = useDocumentStore(
    (state) => state.hasPendingDocuments,
  )
  const checkDocumentStatusUpdates = useDocumentStore(
    (state) => state.checkDocumentStatusUpdates,
  )

  useEffect(() => {
    void checkDocumentStatusUpdates()
  }, [checkDocumentStatusUpdates])

  useEffect(() => {
    if (!hasPendingDocuments) return

    const interval = setInterval(
      () => void checkDocumentStatusUpdates(),
      POLL_INTERVAL_MS,
    )
    return () => clearInterval(interval)
  }, [hasPendingDocuments, checkDocumentStatusUpdates])

  return null
}