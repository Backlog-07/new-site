export function ProductCard({ product, formatPrice }) {
  return (
    <article className="product-card">
      <div className="product-visual">
        <div className="product-ridge" aria-hidden="true" />
        <div className="product-mass" aria-hidden="true" />
        <div className="product-shadow" aria-hidden="true" />
      </div>

      <div className="product-meta">
        <p>{product.label}</p>
        <h3>{product.name}</h3>
      </div>

      <div className="product-footer">
        <span>{product.color}</span>
        <span>{product.stock}</span>
      </div>

      <div className="product-purchase">
        <strong>{formatPrice(product.price)}</strong>
        <button type="button">add to bag</button>
      </div>
    </article>
  )
}
