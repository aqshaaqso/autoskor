import { useCallback, createElement as h } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  Upload,
  FileText,
  X,
  AlertCircle,
  Loader2,
  Clock3,
  RotateCcw,
} from 'lucide-react'
import { useUploadStore } from '@/features/upload/store/useUploadStore'
import {
  ACCEPTED_TYPES,
  getQueueStatusLabel,
  getQueueStatusClasses,
} from '@/features/upload/constants'
import { UploadProgress } from '@/features/upload/components/UploadProgress'
import { formatFileSize } from '@/shared/utils/format'
import { MAX_FILE_UPLOAD_BYTES } from '@/shared/constants/upload'

const btnPrimary =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-base font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

const btnGhost =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-transparent px-3 py-1.5 text-base font-medium text-slate-600 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

function isFileTooLarge(file) {
  return file.size > MAX_FILE_UPLOAD_BYTES
}

export function UploadArea() {
  const {
    selectedFiles,
    uploadQueue,
    isUploadProcessorRunning,
    uploadProgress,
    uploadQueueTotal,
    currentUploadFileName,
    uploadError,
    setSelectedFiles,
    removeSelectedFile,
    clearSelectedFiles,
    uploadFiles,
    removeUploadQueueItem,
    retryUploadQueueItem,
  } = useUploadStore()

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        useUploadStore.setState({
          uploadError: 'Format file tidak didukung. Gunakan PDF atau DOCX.',
        })
        return
      }

      const oversizedFiles = acceptedFiles.filter(isFileTooLarge)
      if (oversizedFiles.length > 0) {
        useUploadStore.setState({
          uploadError: `File "${oversizedFiles[0].name}" melebihi batas ${formatFileSize(MAX_FILE_UPLOAD_BYTES)} per file.`,
        })
        return
      }

      setSelectedFiles([...selectedFiles, ...acceptedFiles])
    },
    [selectedFiles, setSelectedFiles],
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: ACCEPTED_TYPES,
      multiple: true,
    })

  const dropzoneClass = isDragReject
    ? 'border-danger-400 bg-danger-50'
    : isDragActive
      ? 'border-primary-500 bg-primary-50'
      : 'border-slate-300 bg-white hover:border-primary-400 hover:bg-slate-50'

  const isUploadingCurrentFile = uploadQueue.some(
    (item) => item.status === 'uploading',
  )

  return h(
    'div',
    { className: 'space-y-6' },
    h(
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
        'Tarik dan lepas atau klik untuk memilih dokumen — bisa tambah file kapan saja',
      ),
      h(
        'p',
        { className: 'mt-4 text-sm text-slate-400' },
        `Format: PDF, DOCX · Maksimal ${formatFileSize(MAX_FILE_UPLOAD_BYTES)} per file · Upload berurutan di background`,
      ),
    ),
    uploadQueue.length > 0 &&
      h(
        'div',
        {
          className:
            'rounded-xl border border-slate-200 bg-white p-4 shadow-sm',
        },
        h(
          'div',
          { className: 'mb-4' },
          h(
            'p',
            { className: 'text-sm font-semibold text-slate-800' },
            `Antrian upload (${uploadQueue.length})`,
          ),
          h(
            'p',
            { className: 'text-sm text-slate-500' },
            'File diupload satu per satu di background. Kamu tetap bisa menambah dokumen baru.',
          ),
        ),
        h(
          'ul',
          { className: 'space-y-2' },
          uploadQueue.map((item) =>
            h(
              'li',
              {
                key: item.id,
                className:
                  'flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2',
              },
              h(
                'div',
                { className: 'flex min-w-0 items-center gap-3' },
                item.status === 'uploading'
                  ? h(Loader2, {
                      className: 'h-4 w-4 shrink-0 animate-spin text-primary-600',
                    })
                  : item.status === 'pending'
                    ? h(Clock3, {
                        className: 'h-4 w-4 shrink-0 text-warning-600',
                      })
                    : h(AlertCircle, {
                        className: 'h-4 w-4 shrink-0 text-danger-600',
                      }),
                h(
                  'div',
                  { className: 'min-w-0' },
                  h(
                    'p',
                    {
                      className: 'truncate text-sm font-medium text-slate-800',
                    },
                    item.file.name,
                  ),
                  h(
                    'p',
                    { className: 'text-xs text-slate-500' },
                    item.error ?? formatFileSize(item.file.size),
                  ),
                ),
              ),
              h(
                'div',
                { className: 'flex shrink-0 items-center gap-2' },
                h(
                  'span',
                  {
                    className: `inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${getQueueStatusClasses(item.status)}`,
                  },
                  getQueueStatusLabel(item.status),
                ),
                item.status === 'failed' &&
                  h(
                    'button',
                    {
                      type: 'button',
                      className: btnGhost,
                      title: 'Coba lagi',
                      onClick: () => retryUploadQueueItem(item.id),
                    },
                    h(RotateCcw, { className: 'h-4 w-4' }),
                  ),
                item.status !== 'uploading' &&
                  h(
                    'button',
                    {
                      type: 'button',
                      className: btnGhost,
                      title: 'Hapus dari antrian',
                      onClick: () => removeUploadQueueItem(item.id),
                    },
                    h(X, { className: 'h-4 w-4' }),
                  ),
              ),
            ),
          ),
        ),
      ),
    isUploadingCurrentFile &&
      h(UploadProgress, {
        progress: uploadProgress,
        queueTotal: uploadQueueTotal,
        fileName: currentUploadFileName,
      }),
    selectedFiles.length > 0 &&
      h(
        'div',
        {
          className:
            'rounded-xl border border-slate-200 bg-white p-4 shadow-sm',
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
              'Klik konfirmasi untuk memasukkan file ke antrian upload',
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
                      className: `text-xs ${isFileTooLarge(file) ? 'text-danger-600' : 'text-slate-500'}`,
                    },
                    isFileTooLarge(file)
                      ? `Melebihi ${formatFileSize(MAX_FILE_UPLOAD_BYTES)}`
                      : formatFileSize(file.size),
                  ),
                ),
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
        h(
          'div',
          { className: 'mt-4 flex justify-end' },
          h(
            'button',
            {
              type: 'button',
              className: btnPrimary,
              disabled: selectedFiles.some(isFileTooLarge),
              onClick: () => uploadFiles(),
            },
            isUploadProcessorRunning ? 'Tambah ke Antrian' : 'Konfirmasi Upload',
          ),
        ),
      ),
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
          h('p', { className: 'font-medium text-danger-800' }, 'Upload Gagal'),
          h('p', { className: 'mt-1 text-sm text-danger-600' }, uploadError),
        ),
      ),
  )
}