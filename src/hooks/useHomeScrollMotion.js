import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useHomeScrollMotion({ enabled = true } = {}) {
  useLayoutEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return undefined
    }

    const root = document.querySelector('.home-scroll-page')
    if (!root) {
      return undefined
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const sections = Array.from(root.querySelectorAll('.stack-section'))

    if (!sections.length) {
      return undefined
    }

    const ctx = gsap.context(() => {
      sections.forEach((section) => {
        const mediaTargets = Array.from(
          section.querySelectorAll('img, video, .product-showcase-image, .service-image-card, .service-image-placeholder'),
        )
        const sectionImageTargets = Array.from(
          section.querySelectorAll('[data-motion-parallax], [data-motion-zoom]'),
        )
        const runEntrance = () => {
          section.classList.remove('home-scroll-animate')
          // Force the animation to restart on repeat entries.
          void section.offsetWidth
          section.classList.add('home-scroll-animate')
        }

        if (prefersReducedMotion) {
          mediaTargets.forEach((target) => {
            target.style.transform = 'none'
          })

          sectionImageTargets.forEach((target) => {
            target.style.setProperty('--motion-parallax-y', '0px')
            target.style.setProperty('--motion-zoom-scale', '1')
          })

          return
        }

        gsap.set(section, {
          autoAlpha: 1,
        })

        ScrollTrigger.create({
          trigger: section,
          start: 'top 78%',
          onEnter: () => {
            runEntrance()

            if (mediaTargets.length) {
              gsap.fromTo(mediaTargets, { y: 18, scale: 1.02 }, { y: 0, scale: 1, duration: 0.7, ease: 'power2.out', overwrite: 'auto' })
            }
          },
          onEnterBack: () => {
            runEntrance()
          },
          invalidateOnRefresh: true,
        })

        if (sectionImageTargets.length) {
          gsap.to(sectionImageTargets, {
            yPercent: -8,
            scale: 1.03,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true,
            },
          })
        }
      })

      ScrollTrigger.refresh()
    }, root)

    return () => {
      ctx.revert()
    }
  }, [enabled])
}
