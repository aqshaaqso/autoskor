import { useCallback, useEffect, useState } from 'react'
import { getEngineStatus } from '../api/engineApi'

const POLL_INTERVAL_MS = 3000

export function useEngineStatus() {
  const [engineStatus, setEngineStatus] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadEngineStatus = useCallback(async () => {
    try {
      const data = await getEngineStatus()
      setEngineStatus(data)
      setError(null)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Gagal memuat status worker.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadEngineStatus()
  }, [loadEngineStatus])

  useEffect(() => {
    if (!engineStatus) return

    const shouldPoll =
      engineStatus.isRunning ||
      engineStatus.queueLength > 0 ||
      engineStatus.processingCount > 0 ||
      (engineStatus.activeWorkerCount ?? 0) > 0

    if (!shouldPoll) return

    const interval = setInterval(
      () => void loadEngineStatus(),
      POLL_INTERVAL_MS,
    )
    return () => clearInterval(interval)
  }, [engineStatus, loadEngineStatus])

  const clusterStatus = engineStatus?.clusterStatus ?? engineStatus?.status

  return {
    engineStatus,
    isLoading,
    error,
    loadEngineStatus,
    isInitialLoading: isLoading && !engineStatus,
    clusterStatus,
  }
}