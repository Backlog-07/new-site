import productImage from '../assets/BACKLOG (4).png'
import { hasShopifyStorefrontConfig, storefrontQuery } from '../lib/shopifyStorefront.js'

const DEFAULT_SWATCHES = ['#171717', '#ded3c1', '#b31d28']
const DEFAULT_NOTES = ['product details +', 'model wears +', 'sizing chart +']
const DEFAULT_CARE = [
  'Cold wash inside out with like colors.',
  'Use a mild detergent and avoid bleach.',
  'Lay flat or hang to dry for best shape retention.',
]
const DEFAULT_SIZES = [
  { label: 'XXS', available: true, merchandiseId: null },
  { label: 'XS', available: false, merchandiseId: null },
  { label: 'S', available: true, merchandiseId: null },
  { label: 'M', available: true, merchandiseId: null },
  { label: 'L', available: true, merchandiseId: null },
  { label: 'XL', available: true, merchandiseId: null },
  { label: 'XXL', available: false, merchandiseId: null },
]

export const localShowcaseProducts = [
  {
    id: 'lazy-eye-brown',
    handle: 'lazy-eye-linen-shirt-in-brown',
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
    details: 'A relaxed lightweight shirt with a crisp collar and soft drape.',
    careInstructions: DEFAULT_CARE,
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
    handle: 'lazy-eye-linen-shirt-in-white',
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
    details: 'A relaxed lightweight shirt with a crisp collar and soft drape.',
    careInstructions: DEFAULT_CARE,
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
    handle: 'badly-cut-shirt-in-white-unisex',
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
    details: 'An oversized unisex shirt with an intentionally dropped fit.',
    careInstructions: DEFAULT_CARE,
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
    handle: 'dancing-man-shacket-in-blue',
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
    details: 'A cropped workwear layer with a structured outer shell.',
    careInstructions: DEFAULT_CARE,
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

const productCache = new Map()

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
        detailsMetafield: metafield(namespace: "custom", key: "details") {
          namespace
          key
          type
          value
        }
        productDetailsMetafield: metafield(namespace: "custom", key: "product_details") {
          namespace
          key
          type
          value
        }
        careInstructionsMetafield: metafield(namespace: "custom", key: "care_instructions") {
          namespace
          key
          type
          value
        }
        careInstructionsLegacyMetafield: metafield(namespace: "custom", key: "careInstructions") {
          namespace
          key
          type
          value
        }
        washCareMetafield: metafield(namespace: "custom", key: "washcare") {
          namespace
          key
          type
          value
        }
        washCareLegacyMetafield: metafield(namespace: "custom", key: "wash_care") {
          namespace
          key
          type
          value
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
        seo {
          title
          description
        }
      }
    }
  }
`

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

function richTextToPlainText(value) {
  if (!value) {
    return ''
  }

  try {
    const parsed = JSON.parse(value)
    const lines = []

    function walk(node) {
      if (!node) {
        return
      }

      if (Array.isArray(node)) {
        node.forEach(walk)
        return
      }

      if (typeof node === 'string') {
        const trimmed = node.trim()
        if (trimmed) {
          lines.push(trimmed)
        }
        return
      }

      if (typeof node.text === 'string' && node.text.trim()) {
        lines.push(node.text.trim())
      }

      if (node.children) {
        walk(node.children)
      }
    }

    walk(parsed)
    return lines.join(' ').replace(/\s+/g, ' ').trim()
  } catch {
    return String(value).trim()
  }
}

function splitIntoLines(value) {
  return String(value || '')
    .split(/\r?\n+/)
    .map((line) => line.replace(/^[•\-\u2022]+\s*/, '').trim())
    .filter(Boolean)
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
  const detailsMetafield =
    product.detailsMetafield ?? product.productDetailsMetafield ?? null
  const careMetafield =
    product.careInstructionsMetafield ??
    product.careInstructionsLegacyMetafield ??
    product.washCareMetafield ??
    product.washCareLegacyMetafield ??
    null
  const productDescription = product.description?.trim() || 'A minimal garment selected from the Shopify catalog.'
  const detailsText = richTextToPlainText(detailsMetafield?.value) || productDescription
  const careText = richTextToPlainText(careMetafield?.value)
  const careInstructions = splitIntoLines(careText).length ? splitIntoLines(careText) : DEFAULT_CARE

  return {
    id: product.id,
    handle: product.handle,
    title,
    price,
    image,
    imageUrls: normalizedGallery.map((item) => item.src),
    gallery: normalizedGallery,
    variant: `variant-${['a', 'b', 'c', 'd'][index % 4]}`,
    breadcrumb: `entire studios / ${product.handle || title.toLowerCase()}`,
    brandLine: 'ADIDAS X ENTIRE STUDIOS',
    shortName: title.toUpperCase(),
    description: productDescription,
    details: detailsText,
    careInstructions,
    sizes: optionValues(product, 'Size').length ? sizeAvailabilityMap(product) : DEFAULT_SIZES,
    colors: optionValues(product, 'Color').length ? optionValues(product, 'Color') : DEFAULT_SWATCHES,
    detailNotes: DEFAULT_NOTES,
    availability: product.availableForSale ? 'available now' : 'sold out',
    seo: product.seo ?? null,
  }
}

export async function fetchShowcaseProducts(limit = 4) {
  const data = await storefrontQuery(PRODUCTS_QUERY, { first: limit })
  const nodes = data?.products?.nodes ?? []

  if (!nodes.length) {
    return []
  }

  const mappedProducts = nodes.map((node, index) => mapShopifyProduct(node, index))

  mappedProducts.forEach((product) => {
    if (product.handle) {
      productCache.set(product.handle, product)
    }
  })

  return mappedProducts
}

const PRODUCT_BY_HANDLE_QUERY = `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      availableForSale
      featuredImage {
        url
        altText
      }
      images(first: 12) {
        nodes {
          url
          altText
        }
      }
      detailsMetafield: metafield(namespace: "custom", key: "details") {
        namespace
        key
        type
        value
      }
      productDetailsMetafield: metafield(namespace: "custom", key: "product_details") {
        namespace
        key
        type
        value
      }
      careInstructionsMetafield: metafield(namespace: "custom", key: "care_instructions") {
        namespace
        key
        type
        value
      }
      careInstructionsLegacyMetafield: metafield(namespace: "custom", key: "careInstructions") {
        namespace
        key
        type
        value
      }
      washCareMetafield: metafield(namespace: "custom", key: "washcare") {
        namespace
        key
        type
        value
      }
      washCareLegacyMetafield: metafield(namespace: "custom", key: "wash_care") {
        namespace
        key
        type
        value
      }
      seo {
        title
        description
      }
      variants(first: 100) {
        nodes {
          id
          title
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
    }
  }
`

export async function fetchProductByHandle(handle) {
  const normalizedHandle = String(handle || '').trim()

  if (!normalizedHandle) {
    return null
  }

  const cachedProduct = productCache.get(normalizedHandle)
  if (cachedProduct) {
    return cachedProduct
  }

  const localProduct = localShowcaseProducts.find((entry) => entry.handle === normalizedHandle) ?? null
  if (!hasShopifyStorefrontConfig()) {
    return localProduct
  }

  const data = await storefrontQuery(PRODUCT_BY_HANDLE_QUERY, {
    handle: normalizedHandle,
  })

  const node = data?.product ?? null
  if (!node) {
    return null
  }

  return mapShopifyProduct(node, 0)
}

export function getCachedProductByHandle(handle) {
  const normalizedHandle = String(handle || '').trim()
  if (!normalizedHandle) {
    return null
  }

  return productCache.get(normalizedHandle) ?? localShowcaseProducts.find((entry) => entry.handle === normalizedHandle) ?? null
}

export function primeProductCache(product) {
  const handle = String(product?.handle || '').trim()
  if (!handle) {
    return
  }

  productCache.set(handle, product)
}

export async function prefetchProductByHandle(handle) {
  const normalizedHandle = String(handle || '').trim()
  if (!normalizedHandle || productCache.has(normalizedHandle)) {
    return productCache.get(normalizedHandle) ?? null
  }

  const product = await fetchProductByHandle(normalizedHandle)
  if (product) {
    productCache.set(normalizedHandle, product)
  }

  return product
}
