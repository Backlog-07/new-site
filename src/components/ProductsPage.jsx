import { ProductShowcase } from './ProductShowcase.jsx'

export function ProductsPage({ products, loading, error, onSelect, onPrefetch }) {
  return (
    <section className="products-page" aria-label="Products page">
      <ProductShowcase
        products={products}
        loading={loading}
        error={error}
        onSelect={onSelect}
        onPrefetch={onPrefetch}
        showCta={false}
      />
    </section>
  )
}
