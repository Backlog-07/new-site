import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance = null

export function getLenisInstance() {
  return lenisInstance
}

export function scrollToTopImmediate() {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate: true, force: true })
    return
  }

  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
}

export function useLenisSmoothScroll({ enabled = true } = {}) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return undefined
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      lenisInstance = null
      document.documentElement.classList.remove('lenis', 'lenis-smooth')
      ScrollTrigger.refresh()
      return undefined
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => {
        if (t === 0 || t === 1) {
          return t
        }

        return 1 - Math.pow(2, -10 * t)
      },
      smoothWheel: true,
      smoothTouch: false,
      touchInertiaExponent: 1.65,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      autoRaf: false,
      autoResize: true,
      autoToggle: true,
      anchors: true,
      prevent: (node) => {
        if (!node) {
          return false
        }

        return Boolean(
          node.closest(
            '[data-lenis-prevent], [data-lenis-prevent-wheel], [data-lenis-prevent-touch], input, textarea, select, [contenteditable="true"]',
          ),
        )
      },
    })

    lenisInstance = lenis
    document.documentElement.classList.add('lenis', 'lenis-smooth')

    const onScroll = () => {
      ScrollTrigger.update()
    }

    lenis.on('scroll', onScroll)

    let rafId = 0

    const raf = (time) => {
      lenis.raf(time)
      rafId = window.requestAnimationFrame(raf)
    }

    rafId = window.requestAnimationFrame(raf)
    ScrollTrigger.refresh()

    return () => {
      window.cancelAnimationFrame(rafId)
      lenis.off('scroll', onScroll)
      lenis.destroy()
      lenisInstance = null
      document.documentElement.classList.remove('lenis', 'lenis-smooth')
      ScrollTrigger.refresh()
    }
  }, [enabled])
}
