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
      {colors.slice(0, 4).map((color) => (
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

export function ProductShowcase({ products, loading, error, onSelect, onPrefetch }) {
  if (loading && products.length === 0) {
    return (
      <section className="product-showcase product-showcase--loading" aria-label="Featured products" data-motion-reveal>
        {['variant-a', 'variant-b', 'variant-c', 'variant-d'].map((variant) => (
          <ProductCardSkeleton key={variant} className={variant} />
        ))}
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

    return (
      <section className="product-showcase product-showcase--sketch" aria-label="Featured products" data-motion-reveal>
        <div className="product-showcase-sketch-shell">
          <div className="product-showcase-sketch-label">
            <p data-motion-reveal data-motion-parallax="0.86">Products</p>
          </div>
        <button
          type="button"
          className={`product-showcase-card product-showcase-card--sketch ${product.variant}`}
          onClick={() => onSelect(product)}
          onMouseEnter={() => onPrefetch?.(product)}
          onFocus={() => onPrefetch?.(product)}
          onTouchStart={() => onPrefetch?.(product)}
          aria-label={`Open ${product.title}`}
        >
            <div className="product-image-stage product-image-stage--sketch" data-motion-reveal>
              <img
                className="product-showcase-image"
                src={product.image}
                alt={product.title}
                data-motion-zoom="1.08"
              />
            </div>

            <div className="product-grid-meta product-grid-meta--sketch" data-motion-reveal>
              <div className="product-grid-title-row">
                <h2>{product.title}</h2>
                <CartGlyph />
              </div>
              <p className="product-grid-price">{product.price}</p>
              <div className="product-grid-footer">
                <SwatchRow colors={product.colors} />
              </div>
            </div>
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="product-showcase" aria-label="Featured products" data-motion-reveal data-motion-parallax="0.98">
      <div className="product-showcase-grid-label">
        <p data-motion-reveal data-motion-parallax="0.86">Products</p>
      </div>
      {products.map((product, index) => (
        <button
          type="button"
          className={`product-showcase-card ${product.variant}`}
          key={product.title}
          onClick={() => onSelect(product)}
          onMouseEnter={() => onPrefetch?.(product)}
          onFocus={() => onPrefetch?.(product)}
          onTouchStart={() => onPrefetch?.(product)}
          aria-label={`Open ${product.title}`}
        >
          <div className="product-image-stage product-image-stage--grid" data-motion-reveal>
            <img
              className="product-showcase-image"
              src={product.image}
              alt={product.title}
              data-motion-zoom="1.08"
            />
          </div>

          <div className="product-grid-meta" data-motion-reveal>
            <div className="product-grid-title-row">
              <h2>{product.title}</h2>
              <CartGlyph />
            </div>
            <p className="product-grid-price">{product.price}</p>
            <div className="product-grid-footer">
              <SwatchRow colors={product.colors} />
              <span className="product-grid-note">tap to open</span>
            </div>
          </div>
        </button>
      ))}
    </section>
  )
}
