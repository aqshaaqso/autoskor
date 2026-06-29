import { api } from '@/shared/api/client'

export async function fetchEngineStatus() {
  const { data } = await api.get('/engine/status')
  return data
}