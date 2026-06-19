import { useCallback, createElement as h, Fragment } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, X, AlertCircle, Loader2 } from 'lucide-react'
import { useKoperasiStore } from '@/store/useKoperasiStore'
import {
  formatFileSize,
  MAX_TOTAL_UPLOAD_BYTES,
} from '@/utils/colorGrading'
import { UploadProgress } from '@/components/UploadProgress'

const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
}

const btnPrimary =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-base font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

const btnGhost =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-transparent px-3 py-1.5 text-base font-medium text-slate-600 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

function getTotalSize(files) {
  return files.reduce((sum, file) => sum + file.size, 0)
}

export function UploadArea() {
  const {
    selectedFiles,
    isUploading,
    uploadProgress,
    uploadError,
    setSelectedFiles,
    removeSelectedFile,
    clearSelectedFiles,
    uploadFiles,
  } = useKoperasiStore()

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        useKoperasiStore.setState({
          uploadError: 'Format file tidak didukung. Gunakan PDF atau gambar.',
        })
        return
      }

      const merged = [...selectedFiles, ...acceptedFiles]
      const totalSize = getTotalSize(merged)

      if (totalSize > MAX_TOTAL_UPLOAD_BYTES) {
        useKoperasiStore.setState({
          uploadError: `Total ukuran file melebihi ${formatFileSize(MAX_TOTAL_UPLOAD_BYTES)}.`,
        })
        return
      }

      setSelectedFiles(merged)
    },
    [selectedFiles, setSelectedFiles],
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: ACCEPTED_TYPES,
      multiple: true,
      disabled: isUploading,
    })

  const totalSize = getTotalSize(selectedFiles)
  const remainingSize = MAX_TOTAL_UPLOAD_BYTES - totalSize

  const dropzoneClass = isDragReject
    ? 'border-danger-400 bg-danger-50'
    : isDragActive
      ? 'border-primary-500 bg-primary-50'
      : 'border-slate-300 bg-white hover:border-primary-400 hover:bg-slate-50'

  return h(
    'div',
    { className: 'space-y-6' },
    h(
      'div',
      {
        ...getRootProps(),
        className: `relative cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-all ${dropzoneClass} ${isUploading ? 'pointer-events-none opacity-80' : ''}`,
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
        'Tarik dan lepas atau klik untuk memilih satu atau beberapa dokumen',
      ),
      h(
        'p',
        { className: 'mt-4 text-sm text-slate-400' },
        `Format: PDF · Total maksimal ${formatFileSize(MAX_TOTAL_UPLOAD_BYTES)}`,
      ),
    ),
    selectedFiles.length > 0 &&
      h(
        'div',
        { className: 'rounded-xl border border-slate-200 bg-white p-4 shadow-sm' },
        h(
          'div',
          { className: 'mb-4 flex items-center justify-between gap-4' },
          h(
            'div',
            null,
            h(
              'p',
              { className: 'text-sm font-semibold text-slate-800' },
              `${selectedFiles.length} file dipilih`,
            ),
            h(
              'p',
              { className: 'text-sm text-slate-500' },
              `${formatFileSize(totalSize)} digunakan · sisa ${formatFileSize(remainingSize)}`,
            ),
          ),
          h(
            'button',
            {
              type: 'button',
              className: btnGhost,
              disabled: isUploading,
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
                    { className: 'truncate text-sm font-medium text-slate-800' },
                    file.name,
                  ),
                  h(
                    'p',
                    { className: 'text-xs text-slate-500' },
                    formatFileSize(file.size),
                  ),
                ),
              ),
              h(
                'button',
                {
                  type: 'button',
                  className: btnGhost,
                  disabled: isUploading,
                  onClick: () => removeSelectedFile(index),
                },
                h(X, { className: 'h-4 w-4' }),
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
              disabled: isUploading,
              onClick: () => void uploadFiles(),
            },
            isUploading
              ? h(
                  Fragment,
                  null,
                  h(Loader2, { className: 'h-4 w-4 animate-spin' }),
                  'Mengupload...',
                )
              : 'Upload Dokumen',
          ),
        ),
      ),
    isUploading && h(UploadProgress, { progress: uploadProgress }),
    uploadError &&
      h(
        'div',
        {
          className:
            'flex items-start gap-3 rounded-lg border border-danger-200 bg-danger-50 p-4',
        },
        h(AlertCircle, {
          className: 'mt-0.5 h-5 w-5 shrink-0 text-danger-600',
        }),
        h(
          'div',
          null,
          h(
            'p',
            { className: 'font-medium text-danger-800' },
            'Upload Gagal',
          ),
          h('p', { className: 'mt-1 text-sm text-danger-600' }, uploadError),
        ),
      ),
  )
}