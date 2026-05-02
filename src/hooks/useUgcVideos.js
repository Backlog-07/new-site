import { useEffect, useState } from 'react'
import { fetchUgcVideos, getUgcVideoType } from '../data/ugcVideos.js'
import { hasShopifyStorefrontConfig } from '../lib/shopifyStorefront.js'

export function useUgcVideos() {
  const isConfigured = hasShopifyStorefrontConfig()
  const [videos, setVideos] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    if (!isConfigured) {
      setError(new Error('Shopify storefront config is missing.'))
      return () => {
        active = false
      }
    }

    fetchUgcVideos()
      .then((nextVideos) => {
        if (active) {
          setVideos(nextVideos)
        }
      })
      .catch((nextError) => {
        if (active) {
          setError(nextError)
          setVideos([])
        }
      })

    return () => {
      active = false
    }
  }, [isConfigured])

  return {
    videos,
    error,
    loading: isConfigured && videos.length === 0 && !error,
    isConfigured,
    contentType: getUgcVideoType(),
  }
}
