import { useCallback, useEffect, useState } from 'react'
import type { Character } from '../types'

const KEY = 'recent_characters'

export function useRecentCharacters() {
  const [items, setItems] = useState<Character[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {}
  }, [])

  const push = useCallback((c: Character) => {
    setItems((prev) => {
      const existing = prev.filter((x) => x.id !== c.id)
      const updated = [c, ...existing].slice(0, 5)
      try {
        localStorage.setItem(KEY, JSON.stringify(updated))
      } catch {}
      return updated
    })
  }, [])

  return { items, push }
}
