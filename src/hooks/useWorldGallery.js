import { useEffect, useState } from 'react'
import { fetchWorldGallery, getWorldGalleryType } from '../data/worldGallery.js'
import { hasShopifyStorefrontConfig } from '../lib/shopifyStorefront.js'

export function useWorldGallery() {
  const isConfigured = hasShopifyStorefrontConfig()
  const [slides, setSlides] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    if (!isConfigured) {
      setError(new Error('Shopify storefront config is missing.'))
      return () => {
        active = false
      }
    }

    fetchWorldGallery()
      .then((nextSlides) => {
        if (active) {
          setSlides(nextSlides)
        }
      })
      .catch((nextError) => {
        if (active) {
          setError(nextError)
          setSlides([])
        }
      })

    return () => {
      active = false
    }
  }, [isConfigured])

  return {
    slides,
    error,
    loading: isConfigured && slides.length === 0 && !error,
    isConfigured,
    contentType: getWorldGalleryType(),
  }
}
