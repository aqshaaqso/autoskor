export function getClusterStatusLabel(status) {
  switch (status) {
    case 'running':
      return 'Running'
    case 'waiting':
      return 'Waiting'
    case 'idle':
    default:
      return 'Idle'
  }
}

export function getClusterStatusClasses(status) {
  switch (status) {
    case 'running':
      return 'border-primary-200 bg-primary-50 text-primary-700'
    case 'waiting':
      return 'border-warning-200 bg-warning-50 text-warning-700'
    case 'idle':
    default:
      return 'border-success-200 bg-success-50 text-success-700'
  }
}