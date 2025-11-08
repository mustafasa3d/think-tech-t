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
