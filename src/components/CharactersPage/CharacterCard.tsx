import { memo } from 'react'
import type { Character } from '../../types'
import { Link } from 'react-router-dom'

type Props = {
  id: number
  image: string
  name: string
  status: Character['status']
  species: string
  originName: string
}

function StatusBadge({ status }: { status: Character['status'] }) {
  const color = status === 'Alive' ? 'bg-green-500' : status === 'Dead' ? 'bg-red-500' : 'bg-gray-400'
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span className={`inline-block w-2 h-2 rounded-full ${color}`} aria-hidden />
      {status}
    </span>
  )
}

function Card({ id, image, name, status, species, originName }: Props) {
  return (
    <Link to={`/character/${id}`} className="block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md">
      <div className="flex gap-4 p-3 border rounded-md border-gray-200 dark:border-gray-700 hover:bg-gray-50">
        <img src={image} alt={name} width={96} height={96} className="w-24 h-24 rounded object-cover" loading="lazy" decoding="async" />

        <div className="flex-1">
          <h3 className="text-lg font-semibold">{name}</h3>
          <div className="text-sm text-gray-600 dark:text-gray-300"><StatusBadge status={status} /> • {species}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Origin: {originName}</div>
        </div>
      </div>
    </Link>
  )
}

export default memo(Card)
