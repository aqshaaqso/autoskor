import { createElement as h } from 'react'
import {
  Upload,
  ListOrdered,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Users,
} from 'lucide-react'
import { useAuthStore } from '@/features/auth'
import { useUiStore } from '@/shared/store'
import { SidebarMenuItem } from './SidebarMenuItem'
import { UserMenu } from './UserMenu'

const menuItems = [
  { label: 'Upload', path: '/upload', icon: Upload },
  { label: 'Antrian', path: '/queue', icon: ListOrdered },
  { label: 'Selesai', path: '/processed', icon: CheckCircle2 },
  { label: 'Engine', path: '/engine', icon: Cpu, roles: ['admin'] },
  {
    label: 'Aktivitas Pengguna',
    path: '/admin/activity',
    icon: Users,
    roles: ['admin'],
  },
]

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUiStore()
  const userRole = useAuthStore((state) => state.user?.role)
  const visibleMenuItems = menuItems.filter(
    (item) => !item.roles || item.roles.includes(userRole),
  )

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
      visibleMenuItems.map((item) =>
        h(SidebarMenuItem, {
          key: item.path,
          item,
          collapsed: sidebarCollapsed,
        }),
      ),
    ),
    h(UserMenu, { collapsed: sidebarCollapsed }),
  )
}