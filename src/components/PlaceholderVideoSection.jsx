import { useState } from 'react'
import { useLandingVideo } from '../hooks/useLandingVideo.js'

export function PlaceholderVideoSection() {
  const { video } = useLandingVideo()
  const [mediaError, setMediaError] = useState(false)
  const shouldShowFallback = mediaError || !video?.mediaSrc

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
