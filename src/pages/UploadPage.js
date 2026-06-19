import { createElement as h } from 'react'
import { UploadArea } from '@/components/UploadArea'

export function UploadPage() {
  return h(
    'div',
    { className: 'mx-auto max-w-5xl px-6 py-8' },
    h(
      'div',
      { className: 'mb-8' },
      h(
        'h1',
        { className: 'text-2xl font-bold text-slate-900' },
        'Upload Dokumen RAT',
      ),
      h(
        'p',
        { className: 'mt-2 text-slate-500' },
        'Unggah satu atau beberapa dokumen RAT. Total ukuran maksimal 20 MB. Dokumen akan masuk antrian backend untuk diproses engine.',
      ),
    ),
    h(UploadArea),
  )
}