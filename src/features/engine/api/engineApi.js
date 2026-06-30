import { fetchEngineStatus } from '@/shared/api/engine/engineStatusApi'
import {
  mapEngineStatusResponse,
  mergeEngineStatus,
} from '@/shared/api/engine/engineStatusMapper'
import { fetchAllScoringJobDocuments } from '@/shared/api/scoringJobs/scoringJobsApi'
import { mapDocumentsToEngineStatus } from './mapDocumentsToEngineStatus'

export async function getEngineStatus() {
  const [documentsResult, apiResult] = await Promise.allSettled([
    fetchAllScoringJobDocuments(),
    fetchEngineStatus(),
  ])

  if (documentsResult.status === 'rejected') {
    throw documentsResult.reason
  }

  const documents = documentsResult.value
  const documentStatus = mapDocumentsToEngineStatus(documents)

  if (apiResult.status === 'fulfilled') {
    const apiStatus = mapEngineStatusResponse(apiResult.value)
    return mergeEngineStatus(documentStatus, apiStatus)
  }

  return {
    ...documentStatus,
    engineApiUnavailable: true,
  }
}