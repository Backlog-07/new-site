import productImage from '../assets/BACKLOG (4).png'
import { storefrontQuery } from '../lib/shopifyStorefront.js'

export const localShowcaseProducts = [
  {
    id: 'lazy-eye-brown',
    title: 'Lazy Eye Linen Shirt in Brown',
    price: 'INR 23,500.00',
    image: productImage,
    imageUrls: [productImage],
    gallery: [{ src: productImage, alt: 'Lazy Eye Linen Shirt in Brown' }],
    variant: 'variant-a',
    breadcrumb: 'entire studios / lazy eye linen shirt in brown',
    brandLine: 'ADIDAS X ENTIRE STUDIOS',
    shortName: 'LAZY EYE LINEN SHIRT IN BROWN',
    description: 'A relaxed lightweight shirt with a crisp collar and soft drape.',
    sizes: [
      { label: 'XXS', available: true, merchandiseId: null },
      { label: 'XS', available: false, merchandiseId: null },
      { label: 'S', available: true, merchandiseId: null },
      { label: 'M', available: true, merchandiseId: null },
      { label: 'L', available: true, merchandiseId: null },
      { label: 'XL', available: true, merchandiseId: null },
      { label: 'XXL', available: false, merchandiseId: null },
    ],
    colors: ['#171717', '#ded3c1', '#b31d28'],
    detailNotes: ['product details +', 'model wears +', 'sizing chart +'],
    availability: 'available exclusively in the US',
  },
  {
    id: 'lazy-eye-white',
    title: 'Lazy Eye Linen Shirt in White',
    price: 'INR 23,500.00',
    image: productImage,
    imageUrls: [productImage],
    gallery: [{ src: productImage, alt: 'Lazy Eye Linen Shirt in White' }],
    variant: 'variant-b',
    breadcrumb: 'entire studios / lazy eye linen shirt in white',
    brandLine: 'ADIDAS X ENTIRE STUDIOS',
    shortName: 'LAZY EYE LINEN SHIRT IN WHITE',
    description: 'A relaxed lightweight shirt with a crisp collar and soft drape.',
    sizes: [
      { label: 'XXS', available: true, merchandiseId: null },
      { label: 'XS', available: false, merchandiseId: null },
      { label: 'S', available: true, merchandiseId: null },
      { label: 'M', available: true, merchandiseId: null },
      { label: 'L', available: true, merchandiseId: null },
      { label: 'XL', available: true, merchandiseId: null },
      { label: 'XXL', available: false, merchandiseId: null },
    ],
    colors: ['#171717', '#ded3c1', '#b31d28'],
    detailNotes: ['product details +', 'model wears +', 'sizing chart +'],
    availability: 'available exclusively in the US',
  },
  {
    id: 'badly-cut-white',
    title: 'Badly Cut Shirt in White [Unisex]',
    price: 'INR 18,000.00',
    image: productImage,
    imageUrls: [productImage],
    gallery: [{ src: productImage, alt: 'Badly Cut Shirt in White [Unisex]' }],
    variant: 'variant-c',
    breadcrumb: 'entire studios / badly cut shirt in white',
    brandLine: 'ADIDAS X ENTIRE STUDIOS',
    shortName: 'BADLY CUT SHIRT IN WHITE [UNISEX]',
    description: 'An oversized unisex shirt with an intentionally dropped fit.',
    sizes: [
      { label: 'XXS', available: true, merchandiseId: null },
      { label: 'XS', available: false, merchandiseId: null },
      { label: 'S', available: true, merchandiseId: null },
      { label: 'M', available: true, merchandiseId: null },
      { label: 'L', available: true, merchandiseId: null },
      { label: 'XL', available: true, merchandiseId: null },
      { label: 'XXL', available: false, merchandiseId: null },
    ],
    colors: ['#171717', '#ded3c1', '#b31d28'],
    detailNotes: ['product details +', 'model wears +', 'sizing chart +'],
    availability: 'available now: duty free for US',
  },
  {
    id: 'dancing-man-blue',
    title: 'Dancing Man Shacket in Blue',
    price: 'INR 37,000.00',
    image: productImage,
    imageUrls: [productImage],
    gallery: [{ src: productImage, alt: 'Dancing Man Shacket in Blue' }],
    variant: 'variant-d',
    breadcrumb: 'entire studios / dancing man shacket in blue',
    brandLine: 'ADIDAS X ENTIRE STUDIOS',
    shortName: 'DANCING MAN SHACKET IN BLUE',
    description: 'A cropped workwear layer with a structured outer shell.',
    sizes: [
      { label: 'XXS', available: true, merchandiseId: null },
      { label: 'XS', available: false, merchandiseId: null },
      { label: 'S', available: true, merchandiseId: null },
      { label: 'M', available: true, merchandiseId: null },
      { label: 'L', available: true, merchandiseId: null },
      { label: 'XL', available: true, merchandiseId: null },
      { label: 'XXL', available: false, merchandiseId: null },
    ],
    colors: ['#171717', '#ded3c1', '#b31d28'],
    detailNotes: ['product details +', 'model wears +', 'sizing chart +'],
    availability: 'available now: duty free for US',
  },
]

const PRODUCTS_QUERY = `
  query FeaturedProducts($first: Int!) {
    products(first: $first, sortKey: BEST_SELLING) {
      nodes {
        id
        title
        handle
        description
        availableForSale
        featuredImage {
          url
          altText
        }
        images(first: 6) {
          nodes {
            url
            altText
          }
        }
        variants(first: 100) {
          nodes {
            id
            availableForSale
            selectedOptions {
              name
              value
            }
            image {
              url
              altText
            }
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        options {
          name
          values
        }
        variants(first: 100) {
          nodes {
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }
`

const DEFAULT_SWATCHES = ['#171717', '#ded3c1', '#b31d28']
const DEFAULT_NOTES = ['product details +', 'model wears +', 'sizing chart +']
const DEFAULT_SIZES = [
  { label: 'XXS', available: true, merchandiseId: null },
  { label: 'XS', available: false, merchandiseId: null },
  { label: 'S', available: true, merchandiseId: null },
  { label: 'M', available: true, merchandiseId: null },
  { label: 'L', available: true, merchandiseId: null },
  { label: 'XL', available: true, merchandiseId: null },
  { label: 'XXL', available: false, merchandiseId: null },
]

function formatPrice(amount, currencyCode) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(Number(amount))
}

function optionValues(product, optionName) {
  const option = product.options?.find(
    (entry) => entry.name.toLowerCase() === optionName.toLowerCase(),
  )
  return option?.values?.length ? option.values : []
}

function sizeAvailabilityMap(product) {
  const sizeOptions = optionValues(product, 'Size')
  const variants = product.variants?.nodes ?? []

  return sizeOptions.map((size) => {
    const variant = variants.find((entry) =>
      entry.selectedOptions?.some(
        (option) => option.name.toLowerCase() === 'size' && option.value === size,
      ),
    )

    return {
      label: size,
      available: variant?.availableForSale ?? true,
      merchandiseId: variant?.id ?? null,
      image: variant?.image?.url ?? null,
    }
  })
}

function mapShopifyProduct(product, index) {
  const image = product.featuredImage?.url || productImage
  const gallery = (product.images?.nodes ?? [])
    .map((node) => ({
      src: node.url,
      alt: node.altText || product.title,
    }))
    .filter(Boolean)
  const normalizedGallery = gallery.length
    ? gallery
    : [{ src: image, alt: product.title }]
  const title = product.title
  const price = product.priceRange?.minVariantPrice
    ? formatPrice(
        product.priceRange.minVariantPrice.amount,
        product.priceRange.minVariantPrice.currencyCode,
      )
    : 'INR 0.00'

  return {
    id: product.id,
    title,
    price,
    image,
    imageUrls: normalizedGallery.map((item) => item.src),
    gallery: normalizedGallery,
    variant: `variant-${['a', 'b', 'c', 'd'][index % 4]}`,
    breadcrumb: `entire studios / ${product.handle || title.toLowerCase()}`,
    brandLine: 'ADIDAS X ENTIRE STUDIOS',
    shortName: title.toUpperCase(),
    description: product.description || 'A minimal garment selected from the Shopify catalog.',
    sizes: optionValues(product, 'Size').length ? sizeAvailabilityMap(product) : DEFAULT_SIZES,
    colors: optionValues(product, 'Color').length ? optionValues(product, 'Color') : DEFAULT_SWATCHES,
    detailNotes: DEFAULT_NOTES,
    availability: product.availableForSale ? 'available now' : 'sold out',
  }
}

export async function fetchShowcaseProducts(limit = 4) {
  const data = await storefrontQuery(PRODUCTS_QUERY, { first: limit })
  const nodes = data?.products?.nodes ?? []

  if (!nodes.length) {
    return localShowcaseProducts
  }

  return nodes.map((node, index) => mapShopifyProduct(node, index))
}
