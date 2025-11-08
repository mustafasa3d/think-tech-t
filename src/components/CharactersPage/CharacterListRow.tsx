import { memo } from 'react'
import CharacterCard from './CharacterCard'
import type { ListChildComponentProps } from 'react-window'
import { areEqual } from 'react-window'

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

export const MemoRow = memo(Row, areEqual)
