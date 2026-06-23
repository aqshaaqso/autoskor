import { USE_MOCK_ENGINE } from '@/shared/api/config'
import { fetchScoringJobs } from '@/shared/api/scoringJobs/scoringJobsApi'
import { SCORING_JOBS_LIST_LIMIT } from '@/shared/api/scoringJobs/constants'
import { mockGetEngineStatus } from '@/shared/api/mock/engineMock'
import { mapDocumentsToEngineStatus } from './engineStatusMapper'

export async function getEngineStatus() {
  if (USE_MOCK_ENGINE) {
    return mockGetEngineStatus()
  }

  const { documents } = await fetchScoringJobs({
    limit: SCORING_JOBS_LIST_LIMIT,
  })

  return mapDocumentsToEngineStatus(documents)
}