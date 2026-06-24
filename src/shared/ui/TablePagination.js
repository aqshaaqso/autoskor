import { createElement as h } from 'react'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import {
  TABLE_PAGE_SIZE_OPTIONS,
  getCurrentPage,
  getPageRange,
  getTotalPages,
} from '@/shared/constants/pagination'

const selectClass =
  'rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-60'

const navButtonClass =
  'inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50'

export function TablePagination({
  offset = 0,
  limit = 10,
  total = 0,
  pageSizeOptions = TABLE_PAGE_SIZE_OPTIONS,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}) {
  if (total <= 0) return null

  const currentPage = getCurrentPage(offset, limit)
  const totalPages = getTotalPages(total, limit)
  const { start, end } = getPageRange(offset, limit, total)
  const canGoPrev = currentPage > 1 && !isLoading
  const canGoNext = currentPage < totalPages && !isLoading

  return h(
    'div',
    {
      className:
        'flex flex-col gap-3 border-t border-slate-200 bg-slate-50/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between',
    },
    h(
      'div',
      { className: 'flex flex-wrap items-center gap-2 text-sm text-slate-600' },
      h('span', null, 'Tampilkan'),
      h(
        'select',
        {
          className: selectClass,
          value: String(limit),
          disabled: isLoading,
          onChange: (event) => onPageSizeChange?.(Number(event.target.value)),
          'aria-label': 'Jumlah baris per halaman',
        },
        pageSizeOptions.map((size) =>
          h('option', { key: size, value: String(size) }, String(size)),
        ),
      ),
      h('span', null, 'per halaman'),
      isLoading &&
        h(Loader2, {
          className: 'h-4 w-4 animate-spin text-slate-400',
          'aria-hidden': true,
        }),
    ),
    h(
      'div',
      {
        className:
          'flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-4',
      },
      h(
        'p',
        { className: 'text-sm text-slate-600' },
        `Menampilkan ${start}–${end} dari ${total}`,
      ),
      h(
        'div',
        { className: 'flex items-center gap-2' },
        h(
          'button',
          {
            type: 'button',
            className: navButtonClass,
            disabled: !canGoPrev,
            onClick: () => onPageChange?.(currentPage - 1),
            'aria-label': 'Halaman sebelumnya',
          },
          h(ChevronLeft, { className: 'h-4 w-4' }),
          'Sebelumnya',
        ),
        h(
          'span',
          { className: 'min-w-[7rem] text-center text-sm text-slate-600' },
          `Halaman ${currentPage} dari ${totalPages}`,
        ),
        h(
          'button',
          {
            type: 'button',
            className: navButtonClass,
            disabled: !canGoNext,
            onClick: () => onPageChange?.(currentPage + 1),
            'aria-label': 'Halaman berikutnya',
          },
          'Berikutnya',
          h(ChevronRight, { className: 'h-4 w-4' }),
        ),
      ),
    ),
  )
}