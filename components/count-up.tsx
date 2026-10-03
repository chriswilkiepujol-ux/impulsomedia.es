"use client"

import { useEffect, useRef, useState } from "react"

interface CountUpProps {
  target: number
  duration?: number
}

/** Counts up from 0 to target once on mount. Subtle, not flashy. */
export function CountUp({ target, duration = 1100 }: CountUpProps) {
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])

  return <>{value}</>
}
