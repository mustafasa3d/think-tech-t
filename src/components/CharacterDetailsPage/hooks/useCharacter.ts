import { useQuery } from '@tanstack/react-query'
import { api } from '../../../lib/api'
import type { Character } from '../../../types'

export function useCharacter(id: string) {
  return useQuery({
    queryKey: ['character', id],
    queryFn: async () => {
      const res = await api.get<Character>(`/character/${id}`)
      return res.data
    },
    staleTime: 30_000,
    retry: 2,
  })
}
