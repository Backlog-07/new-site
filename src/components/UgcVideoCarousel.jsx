import { useEffect, useMemo, useRef, useState } from 'react'

function CarouselButton({ direction, onClick }) {
  return (
    <button
      type="button"
      className={`ugc-video-carousel__button ugc-video-carousel__button--${direction}`}
      onClick={onClick}
      aria-label={direction === 'prev' ? 'Scroll videos left' : 'Scroll videos right'}
    >
      <span aria-hidden="true">{direction === 'prev' ? '‹' : '›'}</span>
    </button>
  )
}

function UgcVideoCard({ video }) {
  return (
    <article className="ugc-video-card">
      <div className="ugc-video-card__media">
        <video
          className="ugc-video-card__video"
          src={video.videoSrc}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
        />
      </div>
    </article>
  )
}

export function UgcVideoCarousel({ videos = [], loading = false, error = null }) {
  const trackRef = useRef(null)
  const autoScrollRef = useRef(null)
  const prefersReducedMotionRef = useRef(false)
  const [isPaused, setIsPaused] = useState(false)

  const loopedVideos = useMemo(() => {
    if (videos.length <= 1) {
      return videos
    }

    return [...videos, ...videos]
  }, [videos])

  function getLoopWidth(track) {
    return track.scrollWidth / 2
  }

  function scrollByPage(direction, behavior = 'smooth') {
    const track = trackRef.current
    if (!track) {
      return
    }

    const loopWidth = getLoopWidth(track)
    const distance = Math.max(track.clientWidth * 0.88, 320)
    const currentLeft = track.scrollLeft
    let nextLeft = currentLeft + (direction === 'prev' ? distance : -distance)

    if (loopWidth > 0) {
      if (nextLeft >= loopWidth) {
        nextLeft -= loopWidth
      } else if (nextLeft < 0) {
        nextLeft += loopWidth
      }
    }

    track.scrollTo({
      left: nextLeft,
      behavior,
    })
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = () => {
      prefersReducedMotionRef.current = mediaQuery.matches
    }

    updateMotionPreference()

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updateMotionPreference)
      return () => {
        mediaQuery.removeEventListener('change', updateMotionPreference)
      }
    }

    mediaQuery.addListener(updateMotionPreference)
    return () => {
      mediaQuery.removeListener(updateMotionPreference)
    }
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) {
      return undefined
    }

    const handleResize = () => {
      const loopWidth = getLoopWidth(track)
      if (track.scrollLeft >= loopWidth) {
        track.scrollLeft = track.scrollLeft - loopWidth
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [videos.length])

  useEffect(() => {
    const track = trackRef.current
    if (!track || videos.length <= 1) {
      window.clearInterval(autoScrollRef.current)
      return undefined
    }

    window.clearInterval(autoScrollRef.current)

    if (prefersReducedMotionRef.current || isPaused) {
      return undefined
    }

    const canAutoScroll = track.scrollWidth > track.clientWidth + 4
    if (!canAutoScroll) {
      return undefined
    }

    autoScrollRef.current = window.setInterval(() => {
      scrollByPage('next', 'auto')
    }, 800)

    return () => {
      window.clearInterval(autoScrollRef.current)
    }
  }, [videos.length, isPaused])

  if (loading && videos.length === 0) {
    return (
      <section className="ugc-video-carousel" aria-label="Video carousel" data-motion-reveal>
        <div className="ugc-video-carousel__track ugc-video-carousel__track--loading">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={`ugc-skeleton-${index}`} className="ugc-video-card ugc-video-card--skeleton" />
          ))}
        </div>
      </section>
    )
  }

  if (error && videos.length === 0) {
    return (
      <section className="ugc-video-carousel" aria-label="Video carousel" data-motion-reveal>
        <div className="ugc-video-carousel__empty" role="status">
          <p>Video carousel unavailable.</p>
          <p>{error.message || 'Check the Shopify UGC video metaobject settings.'}</p>
        </div>
      </section>
    )
  }

  if (videos.length === 0) {
    return null
  }

  return (
    <section className="ugc-video-carousel" aria-label="Video carousel" data-motion-reveal>
      <div
        className={`ugc-video-carousel__frame${isPaused ? ' is-paused' : ''}`}
        onPointerEnter={() => setIsPaused(true)}
        onPointerLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsPaused(false)
          }
        }}
      >
        <CarouselButton direction="prev" onClick={() => scrollByPage('prev')} />
        <div
          className="ugc-video-carousel__track"
          ref={trackRef}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          onTouchCancel={() => setIsPaused(false)}
        >
          {loopedVideos.map((video, index) => (
            <UgcVideoCard key={video.id || `${video.videoSrc}-${index}`} video={video} />
          ))}
        </div>
        <CarouselButton direction="next" onClick={() => scrollByPage('next')} />
      </div>
    </section>
  )
}
