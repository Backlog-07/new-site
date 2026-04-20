import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function easeOutQuint(value) {
  return 1 - Math.pow(1 - value, 5)
}

gsap.registerPlugin(ScrollTrigger)

export function useLuxuryScroll(dependencies = []) {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isTouchLayout = window.matchMedia('(max-width: 1024px)').matches

    if (reduceMotion) {
      return undefined
    }

    const lenis = new Lenis({
      lerp: 0.06,
      duration: 1.2,
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 0.85,
      touchMultiplier: 0.9,
    })

    const sections = Array.from(document.querySelectorAll('.stack-section'))
    const revealTargets = Array.from(document.querySelectorAll('[data-gsap-reveal]'))
    const parallaxTargets = Array.from(document.querySelectorAll('[data-speed]'))
    const horizontalSections = Array.from(document.querySelectorAll('[data-horizontal-scroll]'))

    const sectionStates = new Map(sections.map((section) => [section, 0]))
    const scene = sections[0]?.closest('.stacking-scene')
    let latestScroll = window.scrollY
    let rafId = 0

    const context = gsap.context(() => {
      revealTargets.forEach((target) => {
        const revealIndex = Number.parseInt(target.dataset.revealIndex || '0', 10)
        const revealDelay = Number.isFinite(revealIndex) ? Math.min(revealIndex * 0.08, 0.3) : 0
        const isProductCard = Boolean(target.closest('.product-showcase'))
        const startYOffset = isProductCard ? 64 : 42
        const startScale = isProductCard ? 0.9 : 0.92
        const revealDuration = isProductCard ? 1.18 : 1.05

        gsap.fromTo(
          target,
          {
            opacity: 0,
            y: startYOffset,
            scale: startScale,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: revealDuration,
            delay: revealDelay,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: target,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })

      parallaxTargets.forEach((target) => {
        const speed = Number.parseFloat(target.dataset.speed || '0.85')
        gsap.to(target, {
          yPercent: (speed - 1) * -14,
          ease: 'none',
          scrollTrigger: {
            trigger: target,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        })
      })

      horizontalSections.forEach((section) => {
        if (isTouchLayout) {
          return
        }

        const track = section.querySelector('[data-horizontal-track]')

        if (!track) {
          return
        }

        const getDistance = () => Math.max(0, track.scrollWidth - section.clientWidth)

        gsap.to(track, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${getDistance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        })
      })
    })

    function syncSectionMotion(scrollPosition) {
      if (!scene) {
        return
      }

      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      const sceneTop = scene.getBoundingClientRect().top + scrollPosition
      const sectionSpan = viewportHeight * 0.92

      sections.forEach((section, index) => {
        const sectionStart = sceneTop + section.offsetTop - viewportHeight * 0.82
        const sectionEnd = sectionStart + sectionSpan
        const progress = clamp((scrollPosition - sectionStart) / (sectionEnd - sectionStart), 0, 1)
        const eased = easeOutQuint(progress)
        const targetY = (1 - eased) * (26 - index * 1.5)
        const currentY = sectionStates.get(section) ?? 0
        const nextY = currentY + (targetY - currentY) * 0.075

        sectionStates.set(section, nextY)
        section.style.setProperty('--stack-translate-y', `${nextY.toFixed(2)}px`)
        section.style.setProperty('--stack-opacity', `${(0.9 + eased * 0.1).toFixed(3)}`)
        section.style.setProperty('--stack-blur', `${Math.max(0, (1 - eased) * 3.5).toFixed(2)}px`)
      })
    }

    const handleScroll = ({ scroll }) => {
      latestScroll = scroll
      syncSectionMotion(scroll)
      ScrollTrigger.update()
    }

    const updateLenis = (time) => {
      lenis.raf(time * 1000)
    }

    lenis.on('scroll', handleScroll)
    gsap.ticker.add(updateLenis)
    gsap.ticker.lagSmoothing(0)

    const tick = () => {
      syncSectionMotion(latestScroll)
      rafId = window.requestAnimationFrame(tick)
    }

    syncSectionMotion(latestScroll)
    rafId = window.requestAnimationFrame(tick)
    ScrollTrigger.refresh()

    return () => {
      window.cancelAnimationFrame(rafId)
      lenis.off('scroll', handleScroll)
      gsap.ticker.remove(updateLenis)
      context.revert()
      lenis.destroy()
    }
  }, dependencies)
}
