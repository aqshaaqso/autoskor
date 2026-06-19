import { createElement as h } from 'react'
import {
  Upload,
  ListOrdered,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useKoperasiStore } from '@/store/useKoperasiStore'
import { SidebarMenuItem } from './SidebarMenuItem'

const menuItems = [
  { label: 'Upload', path: '/upload', icon: Upload },
  { label: 'Antrian', path: '/queue', icon: ListOrdered },
  { label: 'Selesai', path: '/processed', icon: CheckCircle2 },
]

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useKoperasiStore()

  return h(
    'aside',
    {
      className: `flex h-screen flex-col border-r border-slate-800 bg-slate-900 text-white transition-all duration-300 ${
        sidebarCollapsed ? 'w-[72px]' : 'w-64'
      }`,
    },
    h(
      'div',
      {
        className:
          'flex h-16 items-center justify-between border-b border-white/10 px-4',
      },
      !sidebarCollapsed &&
        h(
          'div',
          { className: 'flex items-center gap-2 overflow-hidden' },
          h(
            'div',
            {
              className:
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-sm font-bold',
            },
            'AS',
          ),
          h(
            'div',
            { className: 'min-w-0' },
            h('p', { className: 'truncate text-sm font-semibold' }, 'Auto-Skor'),
            h(
              'p',
              { className: 'truncate text-xs text-slate-400' },
              'Penilaian Kesehatan Koperasi',
            ),
          ),
        ),
      h(
        'button',
        {
          type: 'button',
          onClick: toggleSidebar,
          className:
            'flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white',
          'aria-label': sidebarCollapsed ? 'Perluas sidebar' : 'Ciutkan sidebar',
        },
        sidebarCollapsed
          ? h(ChevronRight, { className: 'h-4 w-4' })
          : h(ChevronLeft, { className: 'h-4 w-4' }),
      ),
    ),
    h(
      'nav',
      { className: 'flex-1 space-y-1 p-3' },
      menuItems.map((item) =>
        h(SidebarMenuItem, {
          key: item.path,
          item,
          collapsed: sidebarCollapsed,
        }),
      ),
    ),
    !sidebarCollapsed &&
      h(
        'div',
        { className: 'border-t border-white/10 p-4 text-xs text-slate-500' },
        'Frontend portal upload & monitoring',
      ),
  )
}