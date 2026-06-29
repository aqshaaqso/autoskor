import { buildEngineStatusFromDocuments } from '../utils/buildEngineStatusFromDocuments'

export function mapDocumentsToEngineStatus(documents) {
  return buildEngineStatusFromDocuments(documents, {
    source: 'scoring-jobs',
  })
}