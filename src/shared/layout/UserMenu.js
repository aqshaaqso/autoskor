import { createElement as h, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronUp, LogOut } from 'lucide-react'
import { useAuthStore } from '@/features/auth'

function getInitials(name) {
  if (!name) return 'U'

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function UserMenu({ collapsed }) {
  const navigate = useNavigate()
  const menuRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleLogout = async () => {
    setIsOpen(false)
    await logout()
    navigate('/login', { replace: true })
  }

  if (!user) return null

  const initials = getInitials(user.name)

  return h(
    'div',
    {
      ref: menuRef,
      className: `relative border-t border-white/10 p-3 ${collapsed ? 'px-2' : ''}`,
    },
    h(
      'button',
      {
        type: 'button',
        onClick: () => setIsOpen((open) => !open),
        className: `flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-slate-800 ${
          collapsed ? 'justify-center' : ''
        }`,
        'aria-expanded': isOpen,
        'aria-haspopup': 'menu',
        title: collapsed ? user.name : undefined,
      },
      h(
        'div',
        {
          className:
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-semibold text-white',
        },
        initials,
      ),
      !collapsed &&
        h(
          'div',
          { className: 'min-w-0 flex-1' },
          h(
            'p',
            { className: 'truncate text-sm font-medium text-white' },
            user.name,
          ),
          h(
            'p',
            { className: 'truncate text-xs text-slate-400' },
            user.koperasi?.name ?? user.role,
          ),
        ),
      !collapsed &&
        h(ChevronUp, {
          className: `h-4 w-4 shrink-0 text-slate-400 transition-transform ${
            isOpen ? '' : 'rotate-180'
          }`,
        }),
    ),
    isOpen &&
      h(
        'div',
        {
          className: `absolute z-20 rounded-xl border border-slate-700 bg-slate-800 p-2 shadow-xl ${
            collapsed
              ? 'bottom-3 left-full ml-2 w-64'
              : 'bottom-full left-3 right-3 mb-2'
          }`,
          role: 'menu',
        },
        h(
          'div',
          { className: 'border-b border-white/10 px-3 py-2.5' },
          h(
            'p',
            { className: 'truncate text-sm font-medium text-white' },
            user.name,
          ),
          h(
            'p',
            { className: 'truncate text-xs text-slate-400' },
            user.email,
          ),
          h(
            'p',
            { className: 'mt-1 text-xs capitalize text-primary-300' },
            user.role,
          ),
          user.koperasi?.name &&
            h(
              'p',
              { className: 'mt-1 truncate text-xs text-slate-400' },
              user.koperasi.name,
            ),
        ),
        h(
          'button',
          {
            type: 'button',
            role: 'menuitem',
            onClick: () => void handleLogout(),
            className:
              'mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-200 transition-colors hover:bg-slate-700 hover:text-white',
          },
          h(LogOut, { className: 'h-4 w-4' }),
          'Keluar',
        ),
      ),
  )
}