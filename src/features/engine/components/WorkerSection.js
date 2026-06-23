import { createElement as h, useState } from 'react'
import { ChevronDown, Server } from 'lucide-react'
import { WorkerTable } from './WorkerTable'

export function WorkerSection({ workers = [] }) {
  const [isOpen, setIsOpen] = useState(true)

  return h(
    'div',
    {
      className:
        'overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm',
    },
    h(
      'button',
      {
        type: 'button',
        onClick: () => setIsOpen((open) => !open),
        className:
          'flex w-full items-center justify-between gap-3 px-6 py-4 text-left transition-colors hover:bg-slate-50',
        'aria-expanded': isOpen,
      },
      h(
        'div',
        { className: 'flex items-center gap-2' },
        h(Server, { className: 'h-5 w-5 text-slate-600' }),
        h(
          'h2',
          { className: 'text-lg font-semibold text-slate-900' },
          'Workers',
        ),
        h(
          'span',
          { className: 'text-sm text-slate-500' },
          `(${workers.length})`,
        ),
      ),
      h(ChevronDown, {
        className: `h-5 w-5 shrink-0 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`,
      }),
    ),
    isOpen &&
      h(
        'div',
        { className: 'border-t border-slate-200 p-4' },
        h(WorkerTable, { workers, embedded: true }),
      ),
  )
}