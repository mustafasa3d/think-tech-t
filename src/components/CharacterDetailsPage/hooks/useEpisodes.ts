import { useQuery } from '@tanstack/react-query'
import { api } from '../../../lib/api'
import type { Episode } from '../../../types'

export function useEpisodes(ids: number[]) {
  return useQuery({
    queryKey: ['episodes', ids.join(',')],
    queryFn: async () => {
      if (!ids.length) return [] as Episode[]
      const res = await api.get<Episode | Episode[]>(`/episode/${ids.join(',')}`)
      const data = Array.isArray(res.data) ? res.data : [res.data]
      return data
    },
    enabled: ids.length > 0,
    staleTime: 60_000,
  })
}
