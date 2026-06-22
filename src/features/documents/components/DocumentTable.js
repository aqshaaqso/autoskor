import { createElement as h } from 'react'
import { Link } from 'react-router-dom'
import { FileText, ChevronRight } from 'lucide-react'
import { DocumentStatusBadge } from '@/features/documents/components/DocumentStatusBadge'
import { formatFileSize, formatDateTime } from '@/shared/utils/format'

export function DocumentTable({
  documents,
  showDetailLink = false,
  showWorker = false,
  showUploader = false,
  emptyMessage,
}) {
  if (documents.length === 0) {
    return h(
      'div',
      {
        className:
          'rounded-xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center',
      },
      h('p', { className: 'text-sm text-slate-500' }, emptyMessage),
    )
  }

  return h(
    'div',
    { className: 'overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm' },
    h(
      'div',
      { className: 'overflow-x-auto' },
      h(
        'table',
        { className: 'w-full min-w-[720px] text-left text-sm' },
        h(
          'thead',
          null,
          h(
            'tr',
            { className: 'border-b border-slate-200 bg-slate-50' },
            h('th', { className: 'px-4 py-3 font-semibold text-slate-700' }, 'Dokumen'),
            h('th', { className: 'px-4 py-3 font-semibold text-slate-700' }, 'Ukuran'),
            h('th', { className: 'px-4 py-3 font-semibold text-slate-700' }, 'Diupload'),
            showUploader &&
              h('th', { className: 'px-4 py-3 font-semibold text-slate-700' }, 'Pengupload'),
            h('th', { className: 'px-4 py-3 font-semibold text-slate-700' }, 'Status'),
            showWorker &&
              h('th', { className: 'px-4 py-3 font-semibold text-slate-700' }, 'Worker'),
            showDetailLink &&
              h('th', { className: 'px-4 py-3 text-right font-semibold text-slate-700' }, 'Aksi'),
          ),
        ),
        h(
          'tbody',
          null,
          documents.map((doc) =>
            h(
              'tr',
              {
                key: doc.id,
                className: 'border-b border-slate-100 transition-colors hover:bg-slate-50/80',
              },
              h(
                'td',
                { className: 'px-4 py-3' },
                h(
                  'div',
                  { className: 'flex items-center gap-3' },
                  h(
                    'div',
                    {
                      className:
                        'flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100',
                    },
                    h(FileText, { className: 'h-4 w-4 text-primary-600' }),
                  ),
                  h(
                    'div',
                    { className: 'min-w-0' },
                    h('span', { className: 'font-medium text-slate-800' }, doc.fileName),
                    doc.failureReason &&
                      h(
                        'p',
                        { className: 'mt-0.5 text-xs text-danger-600' },
                        doc.failureReason,
                      ),
                  ),
                ),
              ),
              h(
                'td',
                { className: 'px-4 py-3 text-slate-600' },
                formatFileSize(doc.fileSize),
              ),
              h(
                'td',
                { className: 'px-4 py-3 text-slate-600' },
                formatDateTime(doc.uploadedAt),
              ),
              showUploader &&
                h(
                  'td',
                  { className: 'px-4 py-3' },
                  doc.uploadedBy
                    ? h(
                        'div',
                        null,
                        h(
                          'p',
                          { className: 'font-medium text-slate-800' },
                          doc.uploadedBy.name,
                        ),
                        h(
                          'p',
                          { className: 'text-xs text-slate-500' },
                          doc.uploadedBy.email,
                        ),
                      )
                    : h('span', { className: 'text-slate-400' }, '-'),
                ),
              h(
                'td',
                { className: 'px-4 py-3' },
                h(DocumentStatusBadge, { status: doc.status }),
              ),
              showWorker &&
                h(
                  'td',
                  { className: 'px-4 py-3 text-slate-600' },
                  doc.workerId ?? '-',
                ),
              showDetailLink &&
                h(
                  'td',
                  { className: 'px-4 py-3 text-right' },
                  doc.status === 'done'
                    ? h(
                        Link,
                        {
                          to: `/processed/${doc.id}`,
                          className:
                            'inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700',
                        },
                        'Lihat Hasil',
                        h(ChevronRight, { className: 'h-4 w-4' }),
                      )
                    : h('span', { className: 'text-sm text-slate-400' }, '-'),
                ),
            ),
          ),
        ),
      ),
    ),
  )
}