import SearchBar from './SearchBar'
import Filters from './Filters'
import SortControl from './SortControl'
import type { SortOrder } from '../types'

type Props = {
  name: string
  status: '' | 'Alive' | 'Dead' | 'Unknown'
  species: string
  sort: SortOrder
  onNameChange: (v: string) => void
  onStatusChange: (v: '' | 'Alive' | 'Dead' | 'Unknown') => void
  onSpeciesChange: (v: string) => void
  onSortChange: (v: SortOrder) => void
  onResetFilters: () => void
}

export default function FiltersSection({
  name,
  status,
  species,
  sort,
  onNameChange,
  onStatusChange,
  onSpeciesChange,
  onSortChange,
  onResetFilters,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
      <div className="md:col-span-2"><SearchBar value={name} onChange={onNameChange} /></div>
      <Filters status={status} species={species} onStatusChange={onStatusChange} onSpeciesChange={onSpeciesChange} />
      <SortControl value={sort} onChange={onSortChange} />
      <button type="button" onClick={onResetFilters} className="px-4 py-2 rounded border border-gray-300 bg-red-700 text-white">Reset All</button>
    </div>
  )
}
