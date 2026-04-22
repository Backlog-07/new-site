import { createPortal } from 'react-dom'
import { useEffect, useMemo, useState } from 'react'

function hashString(input) {
  let hash = 2166136261

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return hash >>> 0
}

function createRng(seed) {
  let value = seed >>> 0

  return function next() {
    value += 0x6d2b79f5
    let t = value
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function flattenWorldItems(slides) {
  const seenSources = new Set()
  const items = []

  slides.forEach((slide, slideIndex) => {
    const mediaSources = slide.images?.length ? slide.images : slide.image ? [slide.image] : []

    mediaSources.forEach((image, imageIndex) => {
      const src = image?.src?.trim()

      if (!src || seenSources.has(src)) {
        return
      }

      seenSources.add(src)
      items.push({
        id: `${slide.id}-${imageIndex}`,
        slide,
        src,
        alt: image.alt || slide.title,
        seedKey: `${slide.id}-${slideIndex}-${imageIndex}-${src}`,
        isCutout: /\.(png|webp)(\?|#|$)/i.test(src),
      })
    })
  })

  return items
}

function buildPlacements(items) {
  const seed = hashString(items.map((item) => item.seedKey).join('|') || 'world')
  const random = createRng(seed)

  return items.map((item, index) => {
    const widthBase = [70, 74, 78, 72, 76, 80, 74, 78, 82, 76, 80, 84]
    const heightBase = [106, 118, 110, 122, 114, 120, 112, 124, 116, 118, 120, 122]

    const width = widthBase[index % widthBase.length] + Math.round((random() - 0.5) * 6)
    const height = heightBase[index % heightBase.length] + Math.round((random() - 0.5) * 10)

    return {
      ...item,
      width: `${Math.max(68, width)}px`,
      height: `${Math.max(102, height)}px`,
    }
  })
}

function WorldContactItem({ item, index, onOpen }) {
  return (
    <button
      type="button"
      className={`world-contact-sheet__item${item.isCutout ? ' world-contact-sheet__item--cutout' : ''}`}
      data-motion-reveal
      style={{
        width: item.width,
        height: item.height,
        '--world-order': index,
      }}
      onClick={() => onOpen(item)}
      aria-label={`Open image ${index + 1}`}
    >
      <span className="world-contact-sheet__index" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>
      <img src={item.src} alt={item.alt || item.slide.title} data-motion-zoom="1.08" />
    </button>
  )
}

function WorldLoadingItem({ item, index }) {
  return (
    <div
      className="world-contact-sheet__item world-contact-sheet__item--loading"
      data-motion-reveal
      style={{
        width: item.width,
        height: item.height,
        '--world-order': index,
      }}
      aria-hidden="true"
    >
      <span className="world-contact-sheet__index" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="world-contact-sheet__skeleton" />
    </div>
  )
}

export function WorldPage({ slides = [], loading = false, compact = false }) {
  const [activeItem, setActiveItem] = useState(null)
  const [lightboxClosing, setLightboxClosing] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsReady(true)
    })

    return () => {
      window.cancelAnimationFrame(frame)
      setIsReady(false)
    }
  }, [slides, loading, compact])

  useEffect(() => {
    if (!activeItem || !lightboxClosing) {
      return undefined
    }

    const timeout = window.setTimeout(() => {
      setActiveItem(null)
      setLightboxClosing(false)
    }, 260)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [activeItem, lightboxClosing])

  useEffect(() => {
    if (!activeItem) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [activeItem])

  const flattenedItems = useMemo(() => flattenWorldItems(slides), [slides])
  const contactItems = useMemo(() => buildPlacements(flattenedItems), [flattenedItems])
  const loadingItems = useMemo(
    () =>
      buildPlacements(
        Array.from({ length: compact ? 10 : 12 }, (_, index) => ({
          id: `world-loading-${index}`,
          slide: { title: `Loading image ${index + 1}` },
          src: '',
          alt: '',
          seedKey: `loading-${index}-${compact ? 'compact' : 'full'}`,
          isCutout: index % 4 === 0,
        })),
      ),
    [compact],
  )

  const railItems = loading && contactItems.length === 0 ? loadingItems : contactItems

  function handleOpenItem(item) {
    if (!loading) {
      setLightboxClosing(false)
      setActiveItem(item)
    }
  }

  function requestCloseLightbox() {
    if (activeItem) {
      setLightboxClosing(true)
    }
  }

  return (
    <section
      className={`world-page${compact ? ' world-page--compact' : ''}${isReady ? ' world-page--ready' : ' world-page--entering'}`}
      aria-label="World"
      data-motion-reveal
    >
      <div className="world-contact-sheet" data-motion-parallax="0.98">
        <div className="world-contact-sheet__rail" data-world-contact-sheet data-world-ready={isReady ? 'true' : 'false'}>
          {railItems.map((item, index) =>
            loading && contactItems.length === 0 ? (
              <WorldLoadingItem key={item.id} item={item} index={index} />
            ) : (
              <WorldContactItem key={item.id} item={item} index={index} onOpen={handleOpenItem} />
            ),
          )}
        </div>
      </div>

      {activeItem
        ? createPortal(
            <div
              className={`world-lightbox${lightboxClosing ? ' world-lightbox--closing' : ' world-lightbox--open'}`}
              role="dialog"
              aria-modal="true"
              aria-label={`Preview ${activeItem.alt || activeItem.slide.title}`}
              onClick={(event) => {
                if (event.target === event.currentTarget) {
                  requestCloseLightbox()
                }
              }}
            >
              <div className="world-lightbox__stage">
                <button
                  type="button"
                  className="world-lightbox__close"
                  onClick={(event) => {
                    event.stopPropagation()
                    requestCloseLightbox()
                  }}
                  aria-label="Close image"
                >
                  <span className="world-lightbox__close-line world-lightbox__close-line--one" aria-hidden="true" />
                  <span className="world-lightbox__close-line world-lightbox__close-line--two" aria-hidden="true" />
                </button>
                <div className="world-lightbox__frame">
                  <img src={activeItem.src} alt={activeItem.alt || activeItem.slide.title} />
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </section>
  )
}
