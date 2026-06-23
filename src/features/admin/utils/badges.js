export function getRoleBadgeClasses(role) {
  if (role === 'admin') {
    return 'border-primary-200 bg-primary-50 text-primary-700'
  }
  return 'border-slate-200 bg-slate-100 text-slate-700'
}

export function getActivityTypeClasses(type) {
  switch (type) {
    case 'login':
      return 'border-primary-200 bg-primary-50 text-primary-700'
    case 'upload':
      return 'border-success-200 bg-success-50 text-success-700'
    case 'processing_failed':
      return 'border-danger-200 bg-danger-50 text-danger-700'
    default:
      return 'border-slate-200 bg-slate-100 text-slate-700'
  }
}