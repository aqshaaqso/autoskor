import { api } from '@/shared/api/client'
import { USE_MOCK } from '@/shared/api/config'
import { mockGetEngineStatus } from '@/shared/api/mock/engineMock'

export async function getEngineStatus() {
  if (USE_MOCK) {
    return mockGetEngineStatus()
  }

  const { data } = await api.get('/engine/status')
  return data
}