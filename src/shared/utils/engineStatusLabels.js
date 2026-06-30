/**
 * Label tampilan status engine (Bahasa Indonesia).
 *
 * Pemetaan dari middleware:
 * - running    → idle    → Siap
 * - processing → working → Bekerja
 * - stop       → busy    → Sibuk
 */

export function getEngineClusterStatusLabel(status) {
  switch (status) {
    case 'working':
    case 'running':
      return 'Bekerja'
    case 'busy':
    case 'stop':
    case 'stopped':
      return 'Sibuk'
    case 'waiting':
      return 'Menunggu'
    case 'idle':
    default:
      return 'Siap'
  }
}

export function getEngineClusterStatusClasses(status) {
  switch (status) {
    case 'working':
    case 'running':
      return 'border-primary-200 bg-primary-50 text-primary-700'
    case 'busy':
    case 'stop':
    case 'stopped':
      return 'border-danger-200 bg-danger-50 text-danger-700'
    case 'waiting':
      return 'border-warning-200 bg-warning-50 text-warning-700'
    case 'idle':
    default:
      return 'border-success-200 bg-success-50 text-success-700'
  }
}

export function getWorkerStatusLabel(status) {
  return getEngineClusterStatusLabel(status)
}

export function getWorkerStatusBadgeClasses(status) {
  return getEngineClusterStatusClasses(status)
}

export function isEngineWorkingStatus(status) {
  return status === 'working' || status === 'running'
}