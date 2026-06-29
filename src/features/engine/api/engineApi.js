import { fetchAllScoringJobDocuments } from '@/shared/api/scoringJobs/scoringJobsApi'
import { mapDocumentsToEngineStatus } from './engineStatusMapper'

export async function getEngineStatus() {
  const documents = await fetchAllScoringJobDocuments()
  return mapDocumentsToEngineStatus(documents)
}