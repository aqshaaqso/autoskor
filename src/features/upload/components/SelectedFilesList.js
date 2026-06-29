import { createElement as h } from 'react'
import { Eye, FileText, X } from 'lucide-react'
import { openLocalFilePreview } from '@/features/preview'
import { canPreviewFile } from '@/shared/utils/file'
import { formatFileSize } from '@/shared/utils/format'
import {
  isFileWithinUploadLimit,
  MAX_FILE_UPLOAD_BYTES,
} from '@/shared/constants/upload'
import { btnGhost, btnPrimary } from './buttonStyles'

export function SelectedFilesList({
  selectedFiles,
  isUploadProcessorRunning,
  clearSelectedFiles,
  removeSelectedFile,
  uploadFiles,
}) {
  if (selectedFiles.length === 0) return null

  return h(
    'div',
    {
      className: 'rounded-xl border border-slate-200 bg-white p-4 shadow-sm',
    },
    h(
      'div',
      { className: 'mb-4 flex items-center justify-between gap-4' },
      h(
        'div',
        null,
        h(
          'p',
          { className: 'text-sm font-semibold text-slate-800' },
          `${selectedFiles.length} file siap dikonfirmasi`,
        ),
        h(
          'p',
          { className: 'text-sm text-slate-500' },
          'Gunakan tombol Preview untuk membuka dokumen di tab browser baru',
        ),
      ),
      h(
        'button',
        {
          type: 'button',
          className: btnGhost,
          onClick: clearSelectedFiles,
        },
        'Hapus Semua',
      ),
    ),
    h(
      'ul',
      { className: 'space-y-2' },
      selectedFiles.map((file, index) =>
        h(
          'li',
          {
            key: `${file.name}-${index}`,
            className:
              'flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2',
          },
          h(
            'div',
            { className: 'flex min-w-0 items-center gap-3' },
            h(FileText, { className: 'h-4 w-4 shrink-0 text-primary-600' }),
            h(
              'div',
              { className: 'min-w-0' },
              h(
                'p',
                {
                  className: 'truncate text-sm font-medium text-slate-800',
                },
                file.name,
              ),
              h(
                'p',
                {
                  className: `text-xs ${!isFileWithinUploadLimit(file) ? 'text-danger-600' : 'text-slate-500'}`,
                },
                !isFileWithinUploadLimit(file)
                  ? `Melebihi ${formatFileSize(MAX_FILE_UPLOAD_BYTES)} per file`
                  : formatFileSize(file.size),
              ),
            ),
          ),
          h(
            'div',
            { className: 'flex shrink-0 items-center gap-2' },
            canPreviewFile(file) &&
              h(
                'button',
                {
                  type: 'button',
                  className: btnGhost,
                  title: 'Buka preview di tab baru',
                  onClick: () => openLocalFilePreview(file),
                },
                h(Eye, { className: 'h-4 w-4' }),
                'Preview',
              ),
            h(
              'button',
              {
                type: 'button',
                className: btnGhost,
                onClick: () => removeSelectedFile(index),
              },
              h(X, { className: 'h-4 w-4' }),
            ),
          ),
        ),
      ),
    ),
    h(
      'div',
      { className: 'mt-4 flex justify-end' },
      h(
        'button',
        {
          type: 'button',
          className: btnPrimary,
          disabled: selectedFiles.some((file) => !isFileWithinUploadLimit(file)),
          onClick: () => uploadFiles(),
        },
        isUploadProcessorRunning ? 'Tambah ke Antrian' : 'Konfirmasi Upload',
      ),
    ),
  )
}