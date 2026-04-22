import { useEffect, useRef, useState } from 'react'

export function PlaceholderVideoSection({ video }) {
  const videoRef = useRef(null)
  const [mediaError, setMediaError] = useState(false)
  const shouldShowFallback = mediaError || !video?.mediaSrc

  useEffect(() => {
    const nextVideo = videoRef.current
    if (!nextVideo) {
      return
    }

    const playPromise = nextVideo.play()
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise.catch(() => {
        // ignore autoplay interruptions
      })
    }
  }, [video?.mediaSrc])

  return (
    <section
      className={`placeholder-video-section${shouldShowFallback ? ' is-fallback' : ''}`}
      aria-label="Featured video"
      data-motion-reveal
      data-motion-parallax="0.98"
    >
      <div className="placeholder-video-hero">
        {!shouldShowFallback && video?.mediaKind === 'image' ? (
          <img
            className="placeholder-video-media"
            src={video.mediaSrc}
            alt={video.title || 'Landing page media'}
            onError={() => setMediaError(true)}
          />
        ) : !shouldShowFallback && video?.mediaKind === 'video' ? (
          <video
            ref={videoRef}
            className="placeholder-video-media"
            src={video.mediaSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setMediaError(true)}
          />
        ) : (
          <div className="placeholder-video-fallback" aria-hidden="true" />
        )}

        <div className="placeholder-video-overlay">
          <span
            className="placeholder-video-aw"
            data-motion-reveal
            data-motion-parallax="0.88"
            style={{ color: '#ffffff', textShadow: '0 1px 4px rgba(0,0,0,0.4)', opacity: 1 }}
          >
            {video?.eyebrow || 'AW25'}
          </span>
          <h1
            className="placeholder-video-wordmark"
            data-motion-reveal
            data-motion-parallax="0.8"
          >
            backlog
          </h1>
        </div>
      </div>
    </section>
  )
}
