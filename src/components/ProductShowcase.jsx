function ProductCardSkeleton({ className }) {
  return (
    <div className={`product-showcase-card product-showcase-skeleton ${className}`}>
      <div className="product-image-stage">
        <div className="product-image-placeholder" />
      </div>
      <div className="product-showcase-copy">
        <span className="product-text-placeholder product-text-placeholder--title" />
        <span className="product-text-placeholder product-text-placeholder--price" />
      </div>
    </div>
  )
}

function SwatchRow({ colors = [] }) {
  return (
    <div className="product-grid-swatches" aria-label="Product colors">
      {(colors.length > 0 ? [colors[0]] : []).map((color) => (
        <span
          key={color}
          className="product-grid-swatch"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

function CartGlyph() {
  return (
    <span className="product-grid-cart" aria-hidden="true">
      <svg viewBox="0 0 24 24" role="presentation" focusable="false">
        <path d="M7 7V6a5 5 0 0 1 10 0v1h3l-1 10.5A2.5 2.5 0 0 1 16.52 20H7.48A2.5 2.5 0 0 1 5 17.5L4 7h3zm2 0h6V6a3 3 0 0 0-6 0v1z" />
      </svg>
    </span>
  )
}

function BookmarkGlyph() {
  return (
    <span className="product-showcase-bookmark" aria-hidden="true">
      <svg viewBox="0 0 24 24" role="presentation" focusable="false">
        <path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4-7 4V4.5a1 1 0 0 1 1-1z" />
      </svg>
    </span>
  )
}

function getStatusLabel(product, index) {
  if (product?.availability && product.availability.toLowerCase().includes('sold out')) {
    return 'sold out'
  }

  return index === 2 ? 'restocked' : 'new:in'
}

function getColorLabel(product) {
  return String(product?.colorLabel || '').trim()
}

function getHoverImage(product) {
  return product?.gallery?.[1]?.src || product?.image || ''
}

function getHoverImageAlt(product) {
  return product?.gallery?.[1]?.alt || product?.title || ''
}

function isLockedProduct(product) {
  const totalInventory = Number(product?.totalInventory ?? 0)

  return totalInventory <= 0
}

function getProductPriceLabel(product) {
  return isLockedProduct(product) ? 'Coming Soon' : product.price
}

export function ProductShowcase({
  products,
  loading,
  error,
  onSelect,
  onPrefetch,
  onBrowseAll,
  showCta = true,
}) {
  if (loading && products.length === 0) {
    return (
      <section className="product-showcase product-showcase--loading" aria-label="Featured products" data-motion-reveal>
        <div className="product-showcase-grid">
          {['variant-a', 'variant-b', 'variant-c', 'variant-d'].map((variant, index) => (
            <ProductCardSkeleton key={`${variant}-${index}`} className={variant} />
          ))}
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className="product-showcase product-showcase-empty" aria-label="Featured products" data-motion-reveal>
        <div className="product-showcase-empty-state">
          <p className="product-showcase-empty-kicker">shopify store</p>
          <h2>No products loaded yet.</h2>
          <p>
            {error
              ? 'Shopify returned an error while loading products. Check the storefront domain, public token, and product access settings.'
              : 'Add your Shopify storefront domain and public access token to the app environment, then restart the dev server so the product grid can pull live data from your store.'}
          </p>
        </div>
      </section>
    )
  }

  if (products.length === 1) {
    const product = products[0]
    const locked = isLockedProduct(product)
    const hoverImage = getHoverImage(product)
    const hoverImageAlt = getHoverImageAlt(product)

    return (
      <section className="product-showcase product-showcase--sketch" aria-label="Featured products" data-motion-reveal>
        <div className="product-showcase-sketch-shell">
          <div className="product-showcase-grid">
            <button
              type="button"
              className={`product-showcase-card product-showcase-card--sketch ${product.variant}${locked ? ' product-showcase-card--locked' : ''}`}
              onClick={locked ? undefined : () => onSelect(product)}
              onMouseEnter={locked ? undefined : () => onPrefetch?.(product)}
              onFocus={locked ? undefined : () => onPrefetch?.(product)}
              onTouchStart={locked ? undefined : () => onPrefetch?.(product)}
              disabled={locked}
              aria-label={locked ? `${product.title} coming soon` : `Open ${product.title}`}
              aria-disabled={locked}
            >
              <div className="product-image-stage product-image-stage--sketch" data-motion-reveal>
                <img
                  className="product-showcase-image"
                  src={product.image}
                  alt={product.title}
                  data-motion-zoom="1.08"
                />
                {hoverImage && hoverImage !== product.image ? (
                  <img
                    className="product-showcase-image product-showcase-image--hover"
                    src={hoverImage}
                    alt={hoverImageAlt}
                    aria-hidden="true"
                    data-motion-zoom="1.08"
                  />
                ) : null}
              </div>

              <div className="product-grid-meta product-grid-meta--sketch" data-motion-reveal>
                <div className="product-grid-title-row">
                  <div className="product-grid-title-copy">
                    <h2>{product.title}</h2>
                    {getColorLabel(product) ? <span className="product-grid-color">{getColorLabel(product)}</span> : null}
                  </div>
                  <p className={`product-grid-price${locked ? ' product-grid-price--locked' : ''}`}>
                    {getProductPriceLabel(product)}
                  </p>
                </div>
              <div className="product-grid-footer">
                  <SwatchRow colors={product.colors} />
                </div>
              </div>
            </button>
          </div>
          {showCta ? (
            <button
              type="button"
              className="product-showcase-cta"
              onClick={() => onBrowseAll?.()}
              aria-label="Shop now"
            >
              shop now
            </button>
          ) : null}
        </div>
      </section>
    )
  }

  return (
    <section className="product-showcase" aria-label="Featured products" data-motion-reveal data-motion-parallax="0.98">
      <div className="product-showcase-grid">
        {products.map((product, index) => (
          (() => {
            const locked = isLockedProduct(product)
            const hoverImage = getHoverImage(product)
            const hoverImageAlt = getHoverImageAlt(product)

            return (
          <button
            type="button"
            className={`product-showcase-card ${product.variant}${locked ? ' product-showcase-card--locked' : ''}`}
            key={product.title}
            onClick={locked ? undefined : () => onSelect(product)}
            onMouseEnter={locked ? undefined : () => onPrefetch?.(product)}
            onFocus={locked ? undefined : () => onPrefetch?.(product)}
            onTouchStart={locked ? undefined : () => onPrefetch?.(product)}
            disabled={locked}
            aria-label={locked ? `${product.title} coming soon` : `Open ${product.title}`}
            aria-disabled={locked}
          >
            <div className="product-image-stage product-image-stage--grid" data-motion-reveal>
              <img
                className="product-showcase-image"
                src={product.image}
                alt={product.title}
                data-motion-zoom="1.08"
              />
              {hoverImage && hoverImage !== product.image ? (
                <img
                  className="product-showcase-image product-showcase-image--hover"
                  src={hoverImage}
                  alt={hoverImageAlt}
                  aria-hidden="true"
                  data-motion-zoom="1.08"
                />
              ) : null}
            </div>

            <div className="product-grid-meta" data-motion-reveal>
              <div className="product-grid-title-row">
                <div className="product-grid-title-copy">
                  <h2>{product.title}</h2>
                  {getColorLabel(product) ? <span className="product-grid-color">{getColorLabel(product)}</span> : null}
                </div>
                <p className={`product-grid-price${locked ? ' product-grid-price--locked' : ''}`}>
                  {getProductPriceLabel(product)}
                </p>
              </div>
              <div className="product-grid-footer">
                <SwatchRow colors={product.colors} />
              </div>
            </div>
          </button>
            )
          })()
        ))}
      </div>
      {showCta ? (
        <button
          type="button"
          className="product-showcase-cta"
          onClick={() => onBrowseAll?.()}
          aria-label="Shop now"
        >
          shop now
        </button>
      ) : null}
    </section>
  )
}
