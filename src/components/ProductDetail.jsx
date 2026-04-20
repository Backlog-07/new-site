import { useEffect, useRef, useState } from 'react'

function VariantPill({
  label,
  selected,
  onClick,
  disabled = false,
  className = '',
}) {
  return (
    <button
      type="button"
      className={`detail-pill${selected ? ' is-selected' : ''}${className ? ` ${className}` : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
    >
      <span>{label}</span>
    </button>
  )
}

export function ProductDetail({
  product,
  onBack,
  onAddToCart,
  onBuyNow,
  addingToCart,
  buyingNow,
}) {
  const firstAvailableSize = product.sizes.find((size) => size.available)?.label ?? ''
  const [selectedSize, setSelectedSize] = useState(firstAvailableSize)
  const [activeInfo, setActiveInfo] = useState('details')
  const [mobileAccordionOpen, setMobileAccordionOpen] = useState('')
  const [mobileImageIndex, setMobileImageIndex] = useState(0)
  const swipeStartX = useRef(0)
  const swipeStartY = useRef(0)
  const selectedSizeEntry =
    product.sizes.find((size) => size.label === selectedSize) ?? null
  const imageUrls =
    product.imageUrls?.length > 0
      ? product.imageUrls
      : product.gallery?.length > 0
        ? product.gallery.map((image) => image.src)
        : [product.image]
  const heroImage = imageUrls[0]
  const scrollImages = imageUrls.slice(1)
  const galleryImages = imageUrls

  useEffect(() => {
    setMobileImageIndex(0)
  }, [product.id])

  function handleCarouselTouchStart(event) {
    const touch = event.touches?.[0]
    if (!touch) {
      return
    }

    swipeStartX.current = touch.clientX
    swipeStartY.current = touch.clientY
  }

  function handleCarouselTouchEnd(event) {
    const touch = event.changedTouches?.[0]
    if (!touch || galleryImages.length < 2) {
      return
    }

    const deltaX = touch.clientX - swipeStartX.current
    const deltaY = touch.clientY - swipeStartY.current

    if (Math.abs(deltaX) < 44 || Math.abs(deltaX) < Math.abs(deltaY)) {
      return
    }

    setMobileImageIndex((current) => {
      if (deltaX < 0) {
        return Math.min(current + 1, galleryImages.length - 1)
      }

      return Math.max(current - 1, 0)
    })
  }

  const infoSections = {
    details: `${product.brandLine} is presented in a clean, minimal silhouette with a focus on texture, proportion, and drape.`,
    washcare: [
      'Cold wash inside out with like colors.',
      'Use a mild detergent and avoid bleach.',
      'Lay flat or hang to dry for best shape retention.',
    ],
  }

  return (
    <section className="product-detail-page product-detail-page--editorial" aria-label={product.title}>
      <div className="product-detail-layout product-detail-layout--editorial">
        <div className="product-detail-media" aria-label={`${product.title} gallery`}>
          <figure className="product-detail-gallery-item product-detail-gallery-item--hero">
            <img src={heroImage} alt={product.title} />
          </figure>

          <div className="product-detail-gallery-column" aria-label={`${product.title} secondary images`}>
            {scrollImages.length > 0 ? (
              scrollImages.map((src, index) => (
                <figure
                  key={`${src}-${index}`}
                  className="product-detail-gallery-item product-detail-gallery-item--scroll"
                >
                  <img src={src} alt={`${product.title} view ${index + 2}`} />
                </figure>
              ))
            ) : (
              <figure className="product-detail-gallery-item product-detail-gallery-item--scroll">
                <img src={heroImage} alt={product.title} />
              </figure>
            )}
          </div>
        </div>

        <div className="product-detail-mobile-carousel" aria-label={`${product.title} gallery carousel`}>
          <div
            className="product-detail-mobile-carousel__track"
            tabIndex={0}
            style={{ transform: `translateX(-${mobileImageIndex * 100}%)` }}
            onTouchStart={handleCarouselTouchStart}
            onTouchEnd={handleCarouselTouchEnd}
            onTouchCancel={handleCarouselTouchEnd}
          >
            {galleryImages.map((src, index) => (
              <figure
                key={`${src}-${index}`}
                className={`product-detail-mobile-carousel__slide${
                  mobileImageIndex === index ? ' is-active' : ''
                }`}
                style={{
                  transform: mobileImageIndex === index ? 'scale(1)' : 'scale(0.96)',
                  opacity: mobileImageIndex === index ? 1 : 0.78,
                }}
              >
                <img src={src} alt={`${product.title} view ${index + 1}`} />
              </figure>
            ))}
          </div>
        </div>

        <aside
          className="product-detail-panel product-detail-panel--editorial"
          style={{
            position: 'sticky',
            top: 0,
            minHeight: '100vh',
            maxHeight: '100vh',
            overflowY: 'auto',
          }}
        >
          <div className="product-detail-panel-inner">
            <p className="detail-kicker">collections / apparel</p>
            <div className="detail-heading-row">
              <h1 className="detail-title">{product.shortName}</h1>
              <p className="detail-price">{product.price}</p>
            </div>
            <div className="detail-info-switcher" aria-label="Product information selectors">
              {[
                { id: 'details', label: 'Details' },
                { id: 'washcare', label: 'Washcare' },
              ].map((section) => (
                <button
                  key={section.id}
                  type="button"
                  className={`detail-info-switch${activeInfo === section.id ? ' is-active' : ''}`}
                  onClick={() => setActiveInfo(section.id)}
                  aria-pressed={activeInfo === section.id}
                >
                  {section.label}
                </button>
              ))}
            </div>

            <div className="detail-info-panel" aria-live="polite">
              {activeInfo === 'details' ? (
                <p className="detail-description">{infoSections.details}</p>
              ) : (
                <ul className="detail-copy-list">
                  {infoSections.washcare.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="detail-variant-group">
              <div className="detail-variant-header">
                <p className="detail-label">Size</p>
                <span className="detail-variant-meta">{selectedSize || 'select a size'}</span>
              </div>
              <div className="detail-pill-row" aria-label="Size options">
                {product.sizes.map((size) => (
                  <VariantPill
                    key={size.label}
                    label={size.label}
                    selected={selectedSize === size.label}
                    disabled={!size.available}
                    onClick={() => size.available && setSelectedSize(size.label)}
                  />
                ))}
              </div>
            </div>

            <div className="detail-actions">
              <button
                type="button"
                className="detail-secondary-btn"
                onClick={() => onAddToCart(selectedSizeEntry).catch(() => {})}
                disabled={!selectedSizeEntry?.available || !selectedSizeEntry?.merchandiseId || addingToCart}
              >
                {addingToCart ? 'ADDING...' : 'ADD TO CART'}
              </button>
              <button
                type="button"
                className="detail-primary-btn"
                onClick={() => onBuyNow(selectedSizeEntry).catch(() => {})}
                disabled={!selectedSizeEntry?.available || !selectedSizeEntry?.merchandiseId || buyingNow}
              >
                {buyingNow ? 'REDIRECTING...' : 'BUY NOW'}
              </button>
            </div>

            <div className="detail-mobile-accordion" aria-label="Product details and care">
              {[
                {
                  id: 'details',
                  label: 'Details',
                  content: infoSections.details,
                  type: 'text',
                },
                {
                  id: 'care',
                  label: 'Care Instructions',
                  content: infoSections.washcare,
                  type: 'list',
                },
              ].map((section) => {
                const isOpen = mobileAccordionOpen === section.id

                return (
                  <div key={section.id} className={`detail-mobile-accordion__item${isOpen ? ' is-open' : ''}`}>
                    <button
                      type="button"
                      className="detail-mobile-accordion__trigger"
                      aria-expanded={isOpen}
                      onClick={() =>
                        setMobileAccordionOpen((current) => (current === section.id ? '' : section.id))
                      }
                    >
                      <span>{section.label}</span>
                      <span className="detail-mobile-accordion__icon" aria-hidden="true">
                        {isOpen ? '-' : '+'}
                      </span>
                    </button>
                    <div className="detail-mobile-accordion__panel" aria-hidden={!isOpen}>
                      {section.type === 'text' ? (
                        <p>{section.content}</p>
                      ) : (
                        <ul>
                          {section.content.map((line) => (
                            <li key={line}>{line}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
