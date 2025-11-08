import type { SortOrder } from '../../types'

type Props = {
  value: SortOrder
  onChange: (v: SortOrder) => void
}

export default function SortControl({ value, onChange }: Props) {
  return (
    <div className='md:col-span-1'>
      <label htmlFor="sort" className="block text-sm font-medium mb-1">Sort</label>
      <select
        id="sort"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOrder)}
        className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="any">Any</option>
        <option value="asc">A→Z</option>
        <option value="desc">Z→A</option>
      </select>
    </div>
  )
}
