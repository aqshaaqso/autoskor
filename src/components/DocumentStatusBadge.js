import { createElement as h } from 'react'
import {
  getDocumentStatusLabel,
  getDocumentStatusClasses,
} from '@/utils/colorGrading'

export function DocumentStatusBadge({ status }) {
  return h(
    'span',
    {
      className: `inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getDocumentStatusClasses(status)}`,
    },
    getDocumentStatusLabel(status),
  )
}