import { getActivityLog } from './activityMock'
import { mockUsers, toPublicUser } from './authMock'
import { getMockDocuments } from './documentsMock'

function buildUserStats(documents, activityLog) {
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

  for (const doc of documents) {
    const userId = doc.uploadedBy?.id
    if (!userId) continue

    const stats = statsByUserId.get(userId)
    if (!stats) continue

    stats.uploadCount += 1

    if (doc.status === 'done') {
      stats.completedCount += 1
    } else if (doc.status === 'failed') {
      stats.failedCount += 1
    } else if (doc.status === 'queued' || doc.status === 'processing') {
      stats.pendingCount += 1
    }

    const docActivityAt = doc.uploadedAt
    if (
      !stats.lastActivityAt ||
      new Date(docActivityAt) > new Date(stats.lastActivityAt)
    ) {
      stats.lastActivityAt = docActivityAt
    }
  }

  for (const entry of activityLog) {
    const stats = statsByUserId.get(entry.userId)
    if (!stats) continue

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

function buildTotals(users, documents, activityLog) {
  const pendingDocuments = documents.filter(
    (doc) => doc.status === 'queued' || doc.status === 'processing',
  ).length
  const completedDocuments = documents.filter((doc) => doc.status === 'done').length

  return {
    userCount: users.length,
    totalUploads: documents.length,
    pendingDocuments,
    completedDocuments,
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

  const documents = getMockDocuments()
  const activityLog = getActivityLog()
  const users = buildUserStats(documents, activityLog)
  const totals = buildTotals(users, documents, activityLog)

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