type Props = {
  value: string
  onChange: (v: string) => void
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="w-full">
      <label htmlFor="search" className="block text-sm font-medium mb-1">Search by name</label>
      <div className="relative">
        <input
          id="search"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g., Rick"
          className="w-full px-3 py-2 pr-10 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Search characters by name"
        />
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => onChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xl leading-none text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}
