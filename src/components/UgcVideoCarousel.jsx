import { useEffect, useMemo, useRef } from 'react'

function CarouselButton({ direction, onClick }) {
  return (
    <button
      type="button"
      className={`ugc-video-carousel__button ugc-video-carousel__button--${direction}`}
      onClick={onClick}
      aria-label={direction === 'prev' ? 'Scroll videos left' : 'Scroll videos right'}
    >
      <span aria-hidden="true">{direction === 'prev' ? '\u2039' : '\u203A'}</span>
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
    let nextLeft = currentLeft + (direction === 'prev' ? -distance : distance)

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
    const track = trackRef.current
    if (!track) {
      return undefined
    }

    const handleResize = () => {
      const loopWidth = getLoopWidth(track)
      if (track.scrollLeft >= loopWidth) {
        track.scrollLeft -= loopWidth
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [videos.length])

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
      <div className="ugc-video-carousel__frame">
        <CarouselButton direction="prev" onClick={() => scrollByPage('prev')} />
        <div className="ugc-video-carousel__track" ref={trackRef}>
          {loopedVideos.map((video, index) => (
            <UgcVideoCard key={video.id || `${video.videoSrc}-${index}`} video={video} />
          ))}
        </div>
        <CarouselButton direction="next" onClick={() => scrollByPage('next')} />
      </div>
    </section>
  )
}
