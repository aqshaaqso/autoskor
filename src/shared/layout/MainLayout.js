import { createElement as h } from 'react'
import { Outlet } from 'react-router-dom'
import { DocumentWatcher } from '@/features/documents'
import { Sidebar } from './Sidebar'
import { Toast } from '@/shared/ui'

export function MainLayout() {
  return h(
    'div',
    { className: 'flex h-screen overflow-hidden bg-slate-100' },
    h(Sidebar),
    h(
      'main',
      { className: 'relative flex-1 overflow-y-auto' },
      h(Outlet),
      h(DocumentWatcher),
      h(Toast),
    ),
  )
}