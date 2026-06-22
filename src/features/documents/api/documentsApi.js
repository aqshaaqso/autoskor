import { api } from '@/shared/api/client'
import { USE_MOCK } from '@/shared/api/config'
import {
  mockUploadDocument,
  mockGetDocuments,
  mockGetDocumentResults,
  filterQueueDocuments,
} from '@/shared/api/mock/documentsMock'

export { filterQueueDocuments }

export async function uploadDocument(file, onProgress) {
  if (USE_MOCK) {
    return mockUploadDocument(file, onProgress)
  }

  const formData = new FormData()
  formData.append('files', file)

  const { data } = await api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (!event.total) return
      const progress = Math.round((event.loaded / event.total) * 100)
      onProgress?.(progress)
    },
  })

  return data
}

export async function getDocuments(status) {
  if (USE_MOCK) {
    return mockGetDocuments(status)
  }

  const { data } = await api.get('/documents', { params: { status } })
  return data
}

export async function getDocumentResults(id) {
  if (USE_MOCK) {
    return mockGetDocumentResults(id)
  }

  const { data } = await api.get(`/documents/${id}/results`)
  return data
}