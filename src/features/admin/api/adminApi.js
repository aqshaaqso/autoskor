import { api } from '@/shared/api/client'
import { USE_MOCK_ADMIN } from '@/shared/api/config'
import { mockGetAdminOverview } from '@/shared/api/mock/adminMock'

export async function getAdminOverview() {
  if (USE_MOCK_ADMIN) {
    return mockGetAdminOverview()
  }

  const { data } = await api.get('/admin/overview')
  return data
}