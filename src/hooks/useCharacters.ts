import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { api } from '../lib/api'
import type { ApiResponse, Character, SortOrder } from '../types'

export type CharacterFilters = {
  name?: string
  status?: '' | 'Alive' | 'Dead' | 'Unknown'
  species?: string
  sort?: SortOrder
}

async function fetchPage(pageParam: number, filters: CharacterFilters) {
  const params: Record<string, string | number> = { page: pageParam }
  if (filters.name) params.name = filters.name
  if (filters.status) params.status = filters.status.toLowerCase()
  if (filters.species) params.species = filters.species

  let attempt = 0
  let delay = 800
  while (true) {
    try {
      const res = await api.get<ApiResponse<Character>>('/character', { params })
      return res.data
    } catch (e: any) {
      attempt += 1
      if (attempt >= 3) throw e
      await new Promise((r) => setTimeout(r, delay))
      delay *= 2
    }
  }
}

export function useCharacters(filters: CharacterFilters) {
  const q = useInfiniteQuery({
    queryKey: ['characters', filters],
    queryFn: ({ pageParam = 1 }) => fetchPage(pageParam, filters),
    initialPageParam: 1,
    getNextPageParam: (
      lastPage: ApiResponse<Character>,
      allPages: ApiResponse<Character>[],
    ) => (lastPage.info.next ? allPages.length + 1 : undefined),
    retry: false,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  })

  const pages = q.data?.pages ?? []
  const data = useMemo(() => {
    const arr = pages.flatMap((p: ApiResponse<Character>) =>
      p.results.map((c) => ({
        id: c.id,
        name: c.name,
        status: c.status,
        species: c.species,
        image: c.image,
        origin: { name: c.origin?.name ?? '' },
      }))
    )
    if (!filters.sort || filters.sort === 'any') {
      return arr
    }
    if (filters.sort === 'asc') {
      return arr.slice().sort((a, b) => a.name.localeCompare(b.name))
    }
    return arr.slice().sort((a, b) => b.name.localeCompare(a.name))
  }, [pages, filters.sort])

  return {
    data,
    isLoading: q.isLoading,
    error: q.error as any,
    refetch: q.refetch,
    fetchNext: q.fetchNextPage,
    hasNext: q.hasNextPage,
    isFetchingNext: q.isFetchingNextPage,
  }
}
