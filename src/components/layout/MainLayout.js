import { createElement as h } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Toast } from '@/components/Toast'
import { DocumentWatcher } from '@/components/DocumentWatcher'

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