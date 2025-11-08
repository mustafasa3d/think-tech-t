import { useRefreshTimer } from '../hooks/useRefreshTimer'

type Props = {
  initialSeconds?: number
  onRefresh: () => void
}

export default function TimerControls({ initialSeconds = 30, onRefresh }: Props) {
  const { secondsLeft, isPaused, toggle, reset } = useRefreshTimer(initialSeconds, onRefresh)
  return (
    <div className="flex items-center gap-3">
      <span aria-live="polite" aria-atomic="true" className="text-sm">Refresh in: {secondsLeft}s</span>
      <button onClick={toggle} className="px-3 py-2 text-sm rounded border border-gray-300">
        {isPaused ? 'Resume' : 'Pause'}
      </button>
      <button onClick={() => { reset(); onRefresh() }} className="px-3 py-2 text-sm rounded border border-gray-300">Refresh</button>
    </div>
  )
}
