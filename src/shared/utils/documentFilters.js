export function isVisibleDocument(doc) {
  return doc.status !== 'canceled' && doc.middlewareStatus !== 'canceled'
}

export function filterVisibleDocuments(documents) {
  return documents.filter(isVisibleDocument)
}

export function filterDocumentsByStatus(documents, status) {
  const visibleDocuments = filterVisibleDocuments(documents)

  if (status === 'queue') {
    return visibleDocuments.filter(
      (doc) => doc.status === 'queued' || doc.status === 'processing',
    )
  }

  if (status === 'done') {
    return visibleDocuments.filter((doc) => doc.status === 'done')
  }

  if (status === 'failed') {
    return visibleDocuments.filter((doc) => doc.status === 'failed')
  }

  if (status === 'processed') {
    return visibleDocuments.filter(
      (doc) => doc.status === 'done' || doc.status === 'failed',
    )
  }

  return visibleDocuments
}