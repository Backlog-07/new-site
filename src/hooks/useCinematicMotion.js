import { useEffect } from 'react'

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export function useCinematicMotion({ enabled = true, scopeKey = 'default' } = {}) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return undefined
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const header = document.querySelector('.site-header')
    const revealTargets = Array.from(document.querySelectorAll('[data-motion-reveal]'))
    const parallaxTargets = Array.from(document.querySelectorAll('[data-motion-parallax], [data-motion-zoom]'))

    if (reduceMotion) {
      revealTargets.forEach((target) => {
        target.classList.add('is-visible')
      })

      if (header) {
        header.dataset.scrollHidden = 'false'
      }

      parallaxTargets.forEach((target) => {
        target.style.setProperty('--motion-parallax-y', '0px')
        target.style.setProperty('--motion-zoom-scale', '1')
      })

      return undefined
    }

    const activeParallax = new Set()

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            revealObserver.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -10% 0px',
      },
    )

    const parallaxObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeParallax.add(entry.target)
          } else {
            activeParallax.delete(entry.target)
            entry.target.style.setProperty('--motion-parallax-y', '0px')
            entry.target.style.setProperty('--motion-zoom-scale', '1')
          }
        })
      },
      {
        threshold: 0.01,
        rootMargin: '18% 0px 18% 0px',
      },
    )

    revealTargets.forEach((target) => {
      target.classList.add('motion-reveal')
      revealObserver.observe(target)
    })

    parallaxTargets.forEach((target) => {
      if (target.hasAttribute('data-motion-parallax')) target.classList.add('motion-parallax')
      if (target.hasAttribute('data-motion-zoom')) target.classList.add('motion-zoom')
      parallaxObserver.observe(target)
    })

    let latestScrollY = window.scrollY
    let headerHidden = false
    let ticking = false
    let rafId = 0

    const updateMotion = () => {
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1

      activeParallax.forEach((target) => {
        if (!target.isConnected) {
          activeParallax.delete(target)
          return
        }

        const rect = target.getBoundingClientRect()
        const targetCenter = rect.top + rect.height / 2
        const distanceFromCenter = (viewportHeight / 2 - targetCenter) / viewportHeight

        if (target.hasAttribute('data-motion-parallax')) {
          const speed = clamp(Number.parseFloat(target.dataset.motionParallax || '0.8'), 0, 1)
          const travel = (1 - speed) * 24
          const y = clamp(distanceFromCenter * travel, -travel, travel)
          target.style.setProperty('--motion-parallax-y', `${y.toFixed(2)}px`)
        }

        if (target.hasAttribute('data-motion-zoom')) {
          const maxScale = Number.parseFloat(target.dataset.motionZoom || '1.05')
          const scale = 1 + (maxScale - 1) * Math.max(0, 1 - Math.abs(distanceFromCenter) * 1.5)
          target.style.setProperty('--motion-zoom-scale', `${scale.toFixed(3)}`)
        }
      })

      if (header) {
        const currentScrollY = window.scrollY
        const delta = currentScrollY - latestScrollY

        if (currentScrollY <= 12) {
          headerHidden = false
        } else if (delta > 5) {
          headerHidden = true
        } else if (delta < -5) {
          headerHidden = false
        }

        header.dataset.scrollHidden = headerHidden ? 'true' : 'false'
        latestScrollY = currentScrollY
      }

      ticking = false
    }

    const requestMotionUpdate = () => {
      if (ticking) {
        return
      }

      ticking = true
      rafId = window.requestAnimationFrame(updateMotion)
    }

    updateMotion()
    window.addEventListener('scroll', requestMotionUpdate, { passive: true })
    window.addEventListener('resize', requestMotionUpdate)

    return () => {
      window.removeEventListener('scroll', requestMotionUpdate)
      window.removeEventListener('resize', requestMotionUpdate)
      window.cancelAnimationFrame(rafId)
      revealObserver.disconnect()
      parallaxObserver.disconnect()
    }
  }, [enabled, scopeKey])
}
