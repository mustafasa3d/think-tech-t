export type ApiInfo = {
  count: number
  pages: number
  next: string | null
  prev: string | null
}

export type ApiResponse<T> = {
  info: ApiInfo
  results: T[]
}

export type Character = {
  id: number
  name: string
  status: 'Alive' | 'Dead' | 'unknown'
  species: string
  type: string
  gender: string
  origin: { name: string; url: string }
  location: { name: string; url: string }
  image: string
  episode: string[]
  url: string
  created: string
}

export type Episode = {
  id: number
  name: string
  air_date: string
  episode: string
  characters: string[]
  url: string
  created: string
}

export type Location = {
  id: number
  name: string
  type: string
  dimension: string
  residents: string[]
  url: string
  created: string
}

export type SortOrder = 'asc' | 'desc' | 'any'
