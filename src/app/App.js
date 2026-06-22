import { createElement as h } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import {
  ProtectedRoute,
  AdminRoute,
  LoginPage,
} from '@/features/auth'
import { UploadPage } from '@/features/upload'
import {
  QueuePage,
  ProcessedPage,
  ProcessedDetailPage,
} from '@/features/documents'
import { EngineDashboardPage } from '@/features/engine'
import { MainLayout } from '@/shared/layout/MainLayout'

export default function App() {
  return h(
    Routes,
    null,
    h(Route, { path: '/login', element: h(LoginPage) }),
    h(
      Route,
      {
        path: '/',
        element: h(ProtectedRoute, null, h(MainLayout)),
      },
      h(Route, { index: true, element: h(Navigate, { to: '/upload', replace: true }) }),
      h(Route, { path: 'upload', element: h(UploadPage) }),
      h(Route, { path: 'queue', element: h(QueuePage) }),
      h(Route, { path: 'processed', element: h(ProcessedPage) }),
      h(Route, { path: 'processed/:id', element: h(ProcessedDetailPage) }),
      h(Route, {
        path: 'engine',
        element: h(AdminRoute, null, h(EngineDashboardPage)),
      }),
    ),
    h(Route, { path: '*', element: h(Navigate, { to: '/upload', replace: true }) }),
  )
}