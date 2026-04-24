import { useEffect, useState } from 'react'
import {
  fetchProductByHandle,
  getCachedProductByHandle,
  localShowcaseProducts,
  primeProductCache,
} from '../data/showcaseProducts.js'
import { hasShopifyStorefrontConfig } from '../lib/shopifyStorefront.js'

export function useShopifyProduct(handle) {
  const isConfigured = hasShopifyStorefrontConfig()
  const normalizedHandle = String(handle || '').trim()
  const [product, setProduct] = useState(() => {
    if (!normalizedHandle) {
      return null
    }

    return getCachedProductByHandle(normalizedHandle)
  })
  const [loading, setLoading] = useState(Boolean(normalizedHandle) && isConfigured && !product)
  const [error, setError] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let active = true

    setError(null)
    setNotFound(false)

    if (!normalizedHandle) {
      setProduct(null)
      setLoading(false)
      return () => {
        active = false
      }
    }

    if (!isConfigured) {
      const localProduct =
        localShowcaseProducts.find((entry) => entry.handle === normalizedHandle) ?? null
      setProduct(localProduct)
      setLoading(false)
      setNotFound(!localProduct)
      if (!localProduct) {
        setError(new Error('Shopify storefront credentials are not configured.'))
      }
      return () => {
        active = false
      }
    }

    const cachedProduct = getCachedProductByHandle(normalizedHandle)
    if (cachedProduct) {
      setProduct(cachedProduct)
      setLoading(false)
      if (isConfigured) {
        fetchProductByHandle(normalizedHandle)
          .then((nextProduct) => {
            if (active && nextProduct) {
              primeProductCache(nextProduct)
              setProduct(nextProduct)
            }
          })
          .catch((nextError) => {
            if (active) {
              setError(nextError)
            }
          })
      }

      return () => {
        active = false
      }
    }

    setLoading(true)

    fetchProductByHandle(normalizedHandle)
      .then((nextProduct) => {
        if (!active) {
          return
        }

        if (!nextProduct) {
          setProduct(null)
          setNotFound(true)
          return
        }

        primeProductCache(nextProduct)
        setProduct(nextProduct)
      })
      .catch((nextError) => {
        if (active) {
          setError(nextError)
          setProduct(null)
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [isConfigured, normalizedHandle])

  return {
    product,
    loading,
    error,
    notFound,
  }
}
