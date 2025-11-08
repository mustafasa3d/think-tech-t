import { Link } from 'react-router-dom'
import type { Character } from '../../types'

type Props = {
  items: Character[]
}

export default function RecentlyViewed({ items }: Props) {
  if (!items.length) return null
  return (
    <div>
      <h2 className="text-base font-semibold mb-2">Recently viewed</h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {items.map((c) => (
          <Link key={c.id} to={`/character/${c.id}`} className="min-w-[140px] border rounded-md p-2 flex items-center gap-2 hover:bg-gray-50">
            <img src={c.image} alt={c.name} className="w-10 h-10 rounded object-cover" />
            <div className="text-sm">
              <div className="font-medium truncate max-w-[100px]">{c.name}</div>
              <div className="text-gray-600 text-xs truncate max-w-[100px]">{c.species}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
