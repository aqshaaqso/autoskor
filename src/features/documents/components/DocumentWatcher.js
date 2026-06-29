import { createElement as h, useEffect } from 'react'
import { DOCUMENT_POLL_INTERVAL_MS } from '../constants'
import { useDocumentStore } from '../store/useDocumentStore'

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

    const poll = () => {
      if (document.visibilityState === 'visible') {
        void checkDocumentStatusUpdates()
      }
    }

    const interval = setInterval(poll, DOCUMENT_POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [hasPendingDocuments, checkDocumentStatusUpdates])

  return null
}