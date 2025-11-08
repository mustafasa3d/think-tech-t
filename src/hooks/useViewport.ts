import { useEffect, useState } from 'react'

export function useViewportHeight(offset = 0) {
  const [h, setH] = useState<number>(Math.max(400, window.innerHeight - offset))
  useEffect(() => {
    function onResize() {
      setH(Math.max(300, window.innerHeight - offset))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [offset])
  return h
}
