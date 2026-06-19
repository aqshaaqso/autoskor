import { createElement as h } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { UploadPage } from '@/pages/UploadPage'
import { QueuePage } from '@/pages/QueuePage'
import { ProcessedPage } from '@/pages/ProcessedPage'
import { ProcessedDetailPage } from '@/pages/ProcessedDetailPage'

export default function App() {
  return h(
    Routes,
    null,
    h(
      Route,
      { path: '/', element: h(MainLayout) },
      h(Route, { index: true, element: h(Navigate, { to: '/upload', replace: true }) }),
      h(Route, { path: 'upload', element: h(UploadPage) }),
      h(Route, { path: 'queue', element: h(QueuePage) }),
      h(Route, { path: 'processed', element: h(ProcessedPage) }),
      h(Route, { path: 'processed/:id', element: h(ProcessedDetailPage) }),
    ),
    h(Route, { path: '*', element: h(Navigate, { to: '/upload', replace: true }) }),
  )
}