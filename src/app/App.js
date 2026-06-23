import { createElement as h, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute, AdminRoute } from '@/features/auth'
import { MainLayout } from '@/shared/layout'
import { PageLoader } from '@/shared/ui/PageLoader'
import {
  LoginPage,
  UploadPage,
  FilePreviewPage,
  QueuePage,
  ProcessedPage,
  ProcessedDetailPage,
  EngineDashboardPage,
  UserActivityPage,
} from './lazyPages'

function suspensePage(PageComponent) {
  return h(
    Suspense,
    { fallback: h(PageLoader) },
    h(PageComponent),
  )
}

export default function App() {
  return h(
    Routes,
    null,
    h(Route, {
      path: '/login',
      element: suspensePage(LoginPage),
    }),
    h(Route, {
      path: '/preview/:previewId',
      element: h(
        ProtectedRoute,
        null,
        suspensePage(FilePreviewPage),
      ),
    }),
    h(
      Route,
      {
        path: '/',
        element: h(ProtectedRoute, null, h(MainLayout)),
      },
      h(Route, { index: true, element: h(Navigate, { to: '/upload', replace: true }) }),
      h(Route, { path: 'upload', element: suspensePage(UploadPage) }),
      h(Route, { path: 'queue', element: suspensePage(QueuePage) }),
      h(Route, { path: 'processed', element: suspensePage(ProcessedPage) }),
      h(Route, { path: 'processed/:id', element: suspensePage(ProcessedDetailPage) }),
      h(Route, {
        path: 'engine',
        element: h(AdminRoute, null, suspensePage(EngineDashboardPage)),
      }),
      h(Route, {
        path: 'admin/activity',
        element: h(AdminRoute, null, suspensePage(UserActivityPage)),
      }),
    ),
    h(Route, { path: '*', element: h(Navigate, { to: '/upload', replace: true }) }),
  )
}