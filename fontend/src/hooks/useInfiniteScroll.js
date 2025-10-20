"use client"

import { useEffect, useRef, useCallback } from "react"

export const useInfiniteScroll = (callback, options = {}) => {
  const { threshold = 0.1 } = options
  const observerTarget = useRef(null)

  const handleIntersection = useCallback(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback()
        }
      })
    },
    [callback],
  )

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
    })

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [handleIntersection, threshold])

  return observerTarget
}
