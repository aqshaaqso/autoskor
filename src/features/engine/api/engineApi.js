import { USE_MOCK_ENGINE } from '@/shared/api/config'
import { fetchAllScoringJobDocuments } from '@/shared/api/scoringJobs/scoringJobsApi'
import { mockGetEngineStatus } from '@/shared/api/mock/engineMock'
import { mapDocumentsToEngineStatus } from './engineStatusMapper'

export async function getEngineStatus() {
  if (USE_MOCK_ENGINE) {
    return mockGetEngineStatus()
  }

  const documents = await fetchAllScoringJobDocuments()
  return mapDocumentsToEngineStatus(documents)
}