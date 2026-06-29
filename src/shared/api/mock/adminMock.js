import { getActivityLog } from './activityMock'
import { mockUsers, toPublicUser } from './authMock'

function buildUserStats(activityLog) {
  const statsByUserId = new Map(
    mockUsers.map((user) => [
      user.id,
      {
        ...toPublicUser(user),
        uploadCount: 0,
        completedCount: 0,
        pendingCount: 0,
        failedCount: 0,
        lastActivityAt: null,
      },
    ]),
  )

  for (const entry of activityLog) {
    const stats = statsByUserId.get(entry.userId)
    if (!stats) continue

    if (entry.type === 'upload') {
      stats.uploadCount += 1
    }

    if (
      !stats.lastActivityAt ||
      new Date(entry.timestamp) > new Date(stats.lastActivityAt)
    ) {
      stats.lastActivityAt = entry.timestamp
    }
  }

  return [...statsByUserId.values()].sort((a, b) => {
    const timeA = a.lastActivityAt ? new Date(a.lastActivityAt).getTime() : 0
    const timeB = b.lastActivityAt ? new Date(b.lastActivityAt).getTime() : 0
    return timeB - timeA
  })
}

function buildTotals(users, activityLog) {
  const uploadCount = activityLog.filter((entry) => entry.type === 'upload').length

  return {
    userCount: users.length,
    totalUploads: uploadCount,
    pendingDocuments: 0,
    completedDocuments: 0,
    activityCount: activityLog.length,
  }
}

function getActivityTypeLabel(type) {
  switch (type) {
    case 'login':
      return 'Login'
    case 'upload':
      return 'Upload'
    case 'processing_failed':
      return 'Gagal Proses'
    default:
      return type
  }
}

export async function mockGetAdminOverview() {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const activityLog = getActivityLog()
  const users = buildUserStats(activityLog)
  const totals = buildTotals(users, activityLog)

  const recentActivity = activityLog.map((entry) => ({
    ...entry,
    typeLabel: getActivityTypeLabel(entry.type),
  }))

  return {
    users,
    recentActivity,
    totals,
  }
}