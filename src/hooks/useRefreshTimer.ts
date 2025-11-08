import { useCallback, useEffect, useRef, useState } from "react";

export function useRefreshTimer(
  seconds = 30,
  onRefresh?: () => Promise<unknown> | void
) {
  const [left, setLeft] = useState(seconds);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const refreshingRef = useRef(false);
  const cbRef = useRef<(() => Promise<unknown> | void) | undefined>(onRefresh);
  cbRef.current = onRefresh;

  const reset = useCallback(() => setLeft(seconds), [seconds]);

  const tick = useCallback(() => {
    setLeft((s) => {
      if (s <= 1) {
        if (!refreshingRef.current && cbRef.current) {
          refreshingRef.current = true;
          Promise.resolve(cbRef.current())
            .catch(() => {})
            .finally(() => {
              refreshingRef.current = false;
            });
        }

        return seconds;
      }
      return s - 1;
    });
  }, [seconds]);

  useEffect(() => {
    if (paused) return;
    intervalRef.current = window.setInterval(tick, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [tick, paused]);

  const toggle = useCallback(() => setPaused((p) => !p), []);

  return {
    secondsLeft: left,
    isPaused: paused,
    pause: () => setPaused(true),
    resume: () => setPaused(false),
    toggle,
    reset,
  };
}

// import { useCallback, useEffect, useRef, useState } from 'react'

// export function useRefreshTimer(seconds = 30, onRefresh?: () => Promise<unknown> | void) {
//   const [left, setLeft] = useState(seconds)
//   const [paused, setPaused] = useState(false)
//   const intervalRef = useRef<number | null>(null)
//   const refreshingRef = useRef(false)
//   const cbRef = useRef<(() => Promise<unknown> | void) | undefined>(onRefresh)
//   cbRef.current = onRefresh

//   // Use a deadline-based timer to avoid duplicate calls in StrictMode
//   const deadlineRef = useRef<number>(Date.now() + seconds * 1000)

//   const reset = useCallback(() => {
//     deadlineRef.current = Date.now() + seconds * 1000
//     setLeft(seconds)
//   }, [seconds])

//   const tick = useCallback(() => {
//     const now = Date.now()
//     const remainingMs = deadlineRef.current - now
//     const remaining = Math.max(0, Math.ceil(remainingMs / 1000))
//     if (remaining <= 0) {
//       if (!refreshingRef.current && cbRef.current) {
//         refreshingRef.current = true
//         Promise.resolve(cbRef.current())
//           .catch(() => {})
//           .finally(() => {
//             refreshingRef.current = false
//           })
//       }
//       deadlineRef.current = now + seconds * 1000
//       setLeft(seconds)
//     } else {
//       setLeft(remaining)
//     }
//   }, [seconds])

//   useEffect(() => {
//     if (paused) return
//     intervalRef.current = window.setInterval(tick, 1000)
//     return () => {
//       if (intervalRef.current) window.clearInterval(intervalRef.current)
//     }
//   }, [tick, paused])

//   const toggle = useCallback(() => setPaused((p) => !p), [])

//   return { secondsLeft: left, isPaused: paused, pause: () => setPaused(true), resume: () => setPaused(false), toggle, reset }
// }
