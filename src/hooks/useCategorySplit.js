import { useEffect, useState } from 'react'
import { fetchCategorySplit, getCategorySplitType } from '../data/categorySplit.js'
import { hasShopifyStorefrontConfig } from '../lib/shopifyStorefront.js'

export function useCategorySplit() {
  const isConfigured = hasShopifyStorefrontConfig()
  const [tiles, setTiles] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    if (!isConfigured) {
      setError(new Error('Shopify storefront config is missing.'))
      return () => {
        active = false
      }
    }

    fetchCategorySplit()
      .then((nextTiles) => {
        if (active) {
          setTiles(nextTiles)
        }
      })
      .catch((nextError) => {
        if (active) {
          setError(nextError)
          setTiles([])
        }
      })

    return () => {
      active = false
    }
  }, [isConfigured])

  return {
    tiles,
    error,
    loading: isConfigured && tiles.length === 0 && !error,
    isConfigured,
    contentType: getCategorySplitType(),
  }
}
