import { createElement as h } from 'react'
import { NavLink } from 'react-router-dom'

const linkBase =
  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors'

export function SidebarMenuItem({ item, collapsed }) {
  return h(
    NavLink,
    {
      to: item.path,
      end: item.path === '/upload',
      className: ({ isActive }) =>
        `${linkBase} ${
          isActive
            ? 'bg-primary-600 text-white'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        } ${collapsed ? 'justify-center px-2' : ''}`,
      title: collapsed ? item.label : undefined,
    },
    h(item.icon, { className: 'h-5 w-5 shrink-0' }),
    !collapsed && h('span', null, item.label),
  )
}