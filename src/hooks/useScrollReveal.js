import { useEffect } from 'react'

/**
 * Activates `.scroll-reveal` elements by adding `.is-visible`
 * when they enter the viewport. Works with the existing CSS system.
 */
export function useScrollReveal(selector = '.scroll-reveal', options = {}) {
  useEffect(() => {
    const { threshold = 0.14, rootMargin = '0px 0px -48px 0px' } = options

    const elements = document.querySelectorAll(selector)
    if (!elements.length) return

    // Respect reduced-motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold, rootMargin },
    )

    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [selector]) // eslint-disable-line react-hooks/exhaustive-deps
}
