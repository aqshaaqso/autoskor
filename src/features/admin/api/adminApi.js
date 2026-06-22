import { api } from '@/shared/api/client'
import { USE_MOCK } from '@/shared/api/config'
import { mockGetAdminOverview } from '@/shared/api/mock/adminMock'

export async function getAdminOverview() {
  if (USE_MOCK) {
    return mockGetAdminOverview()
  }

  const { data } = await api.get('/admin/overview')
  return data
}