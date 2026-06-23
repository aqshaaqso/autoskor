import { lazy } from 'react'

function lazyNamed(importFn, exportName) {
  return lazy(() =>
    importFn().then((module) => ({ default: module[exportName] })),
  )
}

export const LoginPage = lazyNamed(
  () => import('@/features/auth/pages/LoginPage'),
  'LoginPage',
)

export const UploadPage = lazyNamed(
  () => import('@/features/upload/pages/UploadPage'),
  'UploadPage',
)

export const FilePreviewPage = lazyNamed(
  () => import('@/features/upload/pages/FilePreviewPage'),
  'FilePreviewPage',
)

export const QueuePage = lazyNamed(
  () => import('@/features/documents/pages/QueuePage'),
  'QueuePage',
)

export const ProcessedPage = lazyNamed(
  () => import('@/features/documents/pages/ProcessedPage'),
  'ProcessedPage',
)

export const ProcessedDetailPage = lazyNamed(
  () => import('@/features/documents/pages/ProcessedDetailPage'),
  'ProcessedDetailPage',
)

export const EngineDashboardPage = lazyNamed(
  () => import('@/features/engine/pages/EngineDashboardPage'),
  'EngineDashboardPage',
)

export const UserActivityPage = lazyNamed(
  () => import('@/features/admin/pages/UserActivityPage'),
  'UserActivityPage',
)