import { useEffect, useState } from 'react'
import { fetchLandingImage, getLandingImageType } from '../data/landingImage.js'
import { hasShopifyStorefrontConfig } from '../lib/shopifyStorefront.js'

export function useLandingImage() {
  const isConfigured = hasShopifyStorefrontConfig()
  const [image, setImage] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    if (!isConfigured) {
      setError(new Error('Shopify storefront config is missing.'))
      return () => {
        active = false
      }
    }

    fetchLandingImage()
      .then((nextImage) => {
        if (active) {
          setImage(nextImage)
        }
      })
      .catch((nextError) => {
        if (active) {
          setError(nextError)
          setImage(null)
        }
      })

    return () => {
      active = false
    }
  }, [isConfigured])

  return {
    image,
    error,
    loading: isConfigured && !image && !error,
    isConfigured,
    contentType: getLandingImageType(),
  }
}
