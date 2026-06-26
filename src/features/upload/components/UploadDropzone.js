import { createElement as h } from 'react'
import { Upload } from 'lucide-react'
import { formatFileSize } from '@/shared/utils/format'
import { MAX_FILE_UPLOAD_BYTES } from '@/shared/constants/upload'

export function UploadDropzone({ getRootProps, getInputProps, isDragActive, dropzoneClass }) {
  return h(
    'div',
    {
      ...getRootProps(),
      className: `relative cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-all ${dropzoneClass}`,
    },
    h('input', getInputProps()),
    h(
      'div',
      {
        className:
          'mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100',
      },
      h(Upload, { className: 'h-8 w-8 text-primary-600' }),
    ),
    h(
      'h3',
      { className: 'text-xl font-semibold text-slate-800' },
      isDragActive
        ? 'Lepaskan dokumen di sini...'
        : 'Upload Dokumen RAT Disini',
    ),
    h(
      'p',
      { className: 'mt-2 text-base text-slate-500' },
      'Tarik dan lepas atau klik untuk memilih dokumen bisa tambah file kapan saja',
    ),
    h(
      'p',
      { className: 'mt-4 text-sm text-slate-400' },
      `Format: PDF, DOCX · Maksimal ${formatFileSize(MAX_FILE_UPLOAD_BYTES)} total per unggahan`,
    ),
  )
}