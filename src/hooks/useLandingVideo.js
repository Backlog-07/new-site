import { useEffect, useState } from 'react'
import { fetchLandingVideo, getLandingVideoType } from '../data/landingVideo.js'
import { hasShopifyStorefrontConfig } from '../lib/shopifyStorefront.js'

export function useLandingVideo() {
  const isConfigured = hasShopifyStorefrontConfig()
  const [video, setVideo] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    if (!isConfigured) {
      setError(new Error('Shopify storefront config is missing.'))
      return () => {
        active = false
      }
    }

    fetchLandingVideo()
      .then((nextVideo) => {
        if (active) {
          setVideo(nextVideo)
        }
      })
      .catch((nextError) => {
        if (active) {
          setError(nextError)
          setVideo(null)
        }
      })

    return () => {
      active = false
    }
  }, [isConfigured])

  return {
    video,
    error,
    loading: isConfigured && !video && !error,
    isConfigured,
    contentType: getLandingVideoType(),
  }
}
