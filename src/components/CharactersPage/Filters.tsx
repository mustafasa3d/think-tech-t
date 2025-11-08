type Props = {
  status: '' | 'Alive' | 'Dead' | 'Unknown'
  species: string
  onStatusChange: (s: '' | 'Alive' | 'Dead' | 'Unknown') => void
  onSpeciesChange: (s: string) => void
}

export default function Filters({ status, species, onStatusChange, onSpeciesChange }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
      <div>
        <label htmlFor="status" className="block text-sm font-medium mb-1">Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => onStatusChange(e.target.value as Props['status'])}
          className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Any</option>
          <option value="Alive">Alive</option>
          <option value="Dead">Dead</option>
          <option value="Unknown">Unknown</option>
        </select>
      </div>
      <div>
        <label htmlFor="species" className="block text-sm font-medium mb-1">Species</label>
        <select
          id="species"
          value={species}
          onChange={(e) => onSpeciesChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">all</option>
          <option value="Human">Human</option>
          <option value="Alien">Alien</option>
          <option value="Humanoid">Humanoid</option>
          <option value="Robot">Robot</option>
          <option value="Mythological Creature">Mythological Creature</option>
        </select>
      </div>
    </div>
  )
}
