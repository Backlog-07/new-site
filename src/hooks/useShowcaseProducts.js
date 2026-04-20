import { useEffect, useState } from 'react'
import { fetchShowcaseProducts, localShowcaseProducts } from '../data/showcaseProducts.js'
import { hasShopifyStorefrontConfig } from '../lib/shopifyStorefront.js'

export function useShowcaseProducts() {
  const isConfigured = hasShopifyStorefrontConfig()
  const [products, setProducts] = useState(isConfigured ? [] : localShowcaseProducts)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    if (!isConfigured) {
      return () => {
        active = false
      }
    }

    fetchShowcaseProducts()
      .then((nextProducts) => {
        if (active) {
          setProducts(nextProducts)
        }
      })
      .catch((nextError) => {
        if (active) {
          setError(nextError)
          setProducts([])
        }
      })
    return () => {
      active = false
    }
  }, [isConfigured])

  return {
    products,
    error,
    loading: isConfigured && products.length === 0 && !error,
  }
}
