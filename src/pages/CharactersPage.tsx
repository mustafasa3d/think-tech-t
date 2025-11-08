import { useMemo, useDeferredValue, useCallback, memo } from 'react'
import SearchBar from '../components/SearchBar'
import Filters from '../components/Filters'
import SortControl from '../components/SortControl'
import TimerControls from '../components/TimerControls'
import RecentlyViewed from '../components/RecentlyViewed'
import { CharacterCardSkeleton } from '../components/Skeleton'
import CharacterCard from '../components/CharacterCard'
import { useDebounce } from '../hooks/useDebounce'
import { useCharacters } from '../hooks/useCharacters'
import { useRecentCharacters } from '../hooks/useRecentCharacters'
import { FixedSizeList as List, type ListOnItemsRenderedProps, type ListChildComponentProps, areEqual } from 'react-window'
import { useSearchParams } from 'react-router-dom'
import { useViewportHeight } from '../hooks/useViewport'
import type { SortOrder } from '../types'

function Row({ index, style, data }: ListChildComponentProps<any[]>) {
  const item = data[index]
  return (
    <div style={style} className="p-2">
      <CharacterCard
        id={item.id}
        image={item.image}
        name={item.name}
        status={item.status}
        species={item.species}
        originName={item.origin?.name ?? ''}
      />
    </div>
  )
}
const MemoRow = memo(Row, areEqual)

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

  const rawItems = data || []
  // Defer heavy list updates to keep scrolling smooth while data grows
  const items = useDeferredValue(rawItems)
  const itemKey = (index: number) => items[index]?.id ?? index

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
  }, [searchParams, setSearchParams])

  const onItemsRendered = useMemo(() => {
    return ({ visibleStopIndex }: Pick<ListOnItemsRenderedProps, 'visibleStopIndex'>) => {
      if (hasNext && !isFetchingNext && visibleStopIndex >= items.length - 5) {
        fetchNext()
      }
    }
  }, [hasNext, isFetchingNext, items.length, fetchNext])

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Character Explorer</h1>
     
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
        <div className="md:col-span-2"><SearchBar value={name} onChange={onNameChange} /></div>
        <Filters status={status} species={species} onStatusChange={onStatusChange} onSpeciesChange={onSpeciesChange} />
        <SortControl value={sort} onChange={onSortChange} />
        <button type="button" onClick={onResetFilters} className="px-4 py-2 rounded border border-gray-300 bg-red-700 text-white">Reset All</button>
      </div>

      <div className="flex items-center justify-between">
        <TimerControls
          key={`${debouncedName}|${status}|${species}|${sort}`}
          initialSeconds={30}
          onRefresh={onRefresh}
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
        <div className="border rounded-md border-gray-200 dark:border-gray-700">
          <List
            height={Math.max(300, h)}
            itemCount={items.length}
            itemSize={130}
            width={'100%'}
            onItemsRendered={onItemsRendered as any}
            itemKey={itemKey}
            overscanCount={6}
            itemData={items as any}
          >
            {MemoRow as any}
          </List>
          <div className="p-2 flex justify-center bg-gradient-to-t from-black/10 to-white/50">
            {hasNext && (
              <button disabled={isFetchingNext} onClick={() => fetchNext()} className="px-4 py-2 rounded border border-gray-300">
                {isFetchingNext ? 'Loading…' : 'Load more'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
