import { useCallback } from 'react'
import { FixedSizeList as List, type ListOnItemsRenderedProps } from 'react-window'
import { MemoRow } from './CharacterListRow'

type Props = {
  items: any[]
  height: number
  itemSize?: number
  overscan?: number
  hasNext?: boolean
  isFetchingNext?: boolean
  onLoadMore: () => void | Promise<any>
}

export default function CharactersList({
  items,
  height,
  itemSize = 130,
  overscan = 6,
  hasNext,
  isFetchingNext,
  onLoadMore,
}: Props) {
  const itemKey = (index: number) => items[index]?.id ?? index

  const onItemsRendered = useCallback(({ visibleStopIndex }: Pick<ListOnItemsRenderedProps, 'visibleStopIndex'>) => {
    if (hasNext && !isFetchingNext && visibleStopIndex >= items.length - 5) {
      onLoadMore()
    }
  }, [hasNext, isFetchingNext, items.length, onLoadMore])

  return (
    <div className="border rounded-md border-gray-200 dark:border-gray-700">
      <List
        height={height}
        itemCount={items.length}
        itemSize={itemSize}
        width={'100%'}
        onItemsRendered={onItemsRendered as any}
        itemKey={itemKey}
        overscanCount={overscan}
        itemData={items as any}
      >
        {MemoRow as any}
      </List>
      <div className="p-2 flex justify-center bg-gradient-to-t from-black/10 to-white/50">
        {hasNext && (
          <button disabled={isFetchingNext} onClick={() => onLoadMore()} className="px-4 py-2 rounded border border-gray-300">
            {isFetchingNext ? 'Loading…' : 'Load more'}
          </button>
        )}
      </div>
    </div>
  )
}
