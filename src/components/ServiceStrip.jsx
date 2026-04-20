import { useLandingImage } from '../hooks/useLandingImage.js'

function ImagePanel() {
  const { image } = useLandingImage()

  return (
    <article className="service-card service-card--image" aria-label="Landing image">
      <div className="service-image-card">
        {image?.imageSrc ? (
          <img src={image.imageSrc} alt={image.title || 'Landing page image'} />
        ) : (
          <div className="service-image-placeholder" aria-hidden="true">
            <span>loading image</span>
          </div>
        )}
      </div>
    </article>
  )
}

export function ServiceStrip() {
  return (
    <section className="service-strip service-strip--image" aria-label="Landing image">
      <ImagePanel />
    </section>
  )
}
