let activityLog = []

export function logActivity(entry) {
  activityLog.unshift({
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  })

  if (activityLog.length > 100) {
    activityLog = activityLog.slice(0, 100)
  }
}

export function getActivityLog() {
  return [...activityLog]
}