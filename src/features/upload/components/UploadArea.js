import { useCallback, createElement as h } from 'react'
import { useDropzone } from 'react-dropzone'
import { AlertCircle } from 'lucide-react'
import { useUploadStore } from '../store/useUploadStore'
import { ACCEPTED_TYPES } from '../constants'
import { UploadProgress } from './UploadProgress'
import { formatFileSize } from '@/shared/utils/format'
import {
  getTotalFileBytes,
  isBatchWithinUploadLimit,
  MAX_FILE_UPLOAD_BYTES,
} from '@/shared/constants/upload'
import { UploadDropzone } from './UploadDropzone'
import { UploadQueueList } from './UploadQueueList'
import { SelectedFilesList } from './SelectedFilesList'

function getBatchLimitError(files) {
  if (isBatchWithinUploadLimit(files)) return null
  return `Total ukuran file (${formatFileSize(getTotalFileBytes(files))}) melebihi batas ${formatFileSize(MAX_FILE_UPLOAD_BYTES)}.`
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
      let uploadError = null

      if (rejectedFiles.length > 0) {
        uploadError =
          'Beberapa file ditolak karena format tidak didukung. Gunakan PDF atau DOCX.'
      }

      const nextSelection = [...selectedFiles, ...acceptedFiles]
      const batchLimitError = getBatchLimitError(nextSelection)

      if (batchLimitError) {
        uploadError = batchLimitError
      } else if (acceptedFiles.length > 0) {
        setSelectedFiles(nextSelection)
      }

      if (uploadError) {
        useUploadStore.setState({ uploadError })
      } else if (acceptedFiles.length > 0) {
        useUploadStore.setState({ uploadError: null })
      }
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
    h(UploadDropzone, {
      getRootProps,
      getInputProps,
      isDragActive,
      dropzoneClass,
    }),
    h(UploadQueueList, {
      uploadQueue,
      removeUploadQueueItem,
      retryUploadQueueItem,
    }),
    isUploadingCurrentFile &&
      h(UploadProgress, {
        progress: uploadProgress,
        queueTotal: uploadQueueTotal,
        fileName: currentUploadFileName,
      }),
    h(SelectedFilesList, {
      selectedFiles,
      isUploadProcessorRunning,
      clearSelectedFiles,
      removeSelectedFile,
      uploadFiles,
    }),
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