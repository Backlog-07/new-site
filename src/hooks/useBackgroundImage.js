import { useEffect, useState } from 'react'
import { fetchBackgroundImage, getBackgroundImageType } from '../data/backgroundImage.js'
import { hasShopifyStorefrontConfig } from '../lib/shopifyStorefront.js'

export function useBackgroundImage() {
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

    fetchBackgroundImage()
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
    contentType: getBackgroundImageType(),
  }
}
