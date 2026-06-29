import { createElement as h } from 'react'
import {
  getUiDocumentStatusBadgeClasses,
  getUiDocumentStatusLabel,
} from '@/shared/utils/documentStatusLabels'

export function DocumentStatusBadge({ status }) {
  return h(
    'span',
    {
      className: `inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getUiDocumentStatusBadgeClasses(status)}`,
    },
    getUiDocumentStatusLabel(status),
  )
}