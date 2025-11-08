import { useDeferredValue, useCallback, useState } from 'react'
import FiltersSection from '../components/CharactersPage/FiltersSection'
import TimerControls from '../components/CharactersPage/TimerControls'
import RecentlyViewed from '../components/CharactersPage/RecentlyViewed'
import { CharacterCardSkeleton } from '../components/Skeleton'
import CharactersList from '../components/CharactersPage/CharactersList'
import { useDebounce } from '../hooks/useDebounce'
import { useCharacters } from '../components/CharactersPage/hooks/useCharacters'
import { useRecentCharacters } from '../components/CharactersPage/hooks/useRecentCharacters'
import { useSearchParams } from 'react-router-dom'
import { useViewportHeight } from '../hooks/useViewport'
import type { SortOrder } from '../types'

export default function CharactersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const name = searchParams.get('name') ?? ''
  const statusRaw = (searchParams.get('status') ?? '') as '' | 'Alive' | 'Dead' | 'Unknown'
  const status: '' | 'Alive' | 'Dead' | 'Unknown' =
    statusRaw === 'Alive' || statusRaw === 'Dead' || statusRaw === 'Unknown' ? statusRaw : ''
  const species = searchParams.get('species') ?? ''
  const sortParam = searchParams.get('sort')
  const sort: SortOrder = sortParam === 'asc' || sortParam === 'desc' ? (sortParam as SortOrder) : 'any'
  const debouncedName = useDebounce(name, 1000)

  const { data, isLoading, error, refetch, fetchNext, hasNext, isFetchingNext } = useCharacters({
    name: debouncedName,
    status,
    species,
    sort,
  })

  const { items: recent } = useRecentCharacters()
  const h = useViewportHeight(240)
  const [resetAllTick, setResetAllTick] = useState(0)

  const rawItems = data || []
  // Defer heavy list updates to keep scrolling smooth while data grows
  const items = useDeferredValue(rawItems)

  const onRefresh = useCallback(() => { return refetch() }, [refetch])

  const updateParam = useCallback((key: string, value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  const onNameChange = useCallback((v: string) => updateParam('name', v), [updateParam])
  const onStatusChange = useCallback((v: '' | 'Alive' | 'Dead' | 'Unknown') => updateParam('status', v), [updateParam])
  const onSpeciesChange = useCallback((v: string) => updateParam('species', v), [updateParam])
  const onSortChange = useCallback((v: SortOrder) => updateParam('sort', v === 'any' ? '' : v), [updateParam])
  const onResetFilters = useCallback(() => {
    const next = new URLSearchParams(searchParams)
    next.delete('name')
    next.delete('status')
    next.delete('species')
    next.delete('sort')
    setSearchParams(next, { replace: true })
    setResetAllTick((t) => t + 1)
  }, [searchParams, setSearchParams])

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Character Explorer</h1>
     
      <FiltersSection
        name={name}
        status={status}
        species={species}
        sort={sort}
        onNameChange={onNameChange}
        onStatusChange={onStatusChange}
        onSpeciesChange={onSpeciesChange}
        onSortChange={onSortChange}
        onResetFilters={onResetFilters}
      />

      <div className="flex items-center justify-between">
        <TimerControls
          initialSeconds={30}
          onRefresh={onRefresh}
          startOn={resetAllTick}
        />
        {error && (
          <div role="status" className="text-sm text-red-600">Failed to load. {navigator.onLine ? 'Please retry.' : 'You appear to be offline.'}</div>
        )}
      </div>

      <RecentlyViewed items={recent} />

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (<CharacterCardSkeleton key={i} />))}
        </div>
      ) : (
        <CharactersList
          items={items as any[]}
          height={Math.max(300, h)}
          itemSize={130}
          overscan={6}
          hasNext={hasNext}
          isFetchingNext={isFetchingNext}
          onLoadMore={() => fetchNext()}
        />
      )}
    </div>
  )
}
