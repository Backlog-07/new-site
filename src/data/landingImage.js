import { storefrontQuery } from '../lib/shopifyStorefront.js'

const LANDING_IMAGE_QUERY = `
  query LandingImage($type: String!, $first: Int!) {
    metaobjects(type: $type, first: $first) {
      nodes {
        id
        handle
        type
        fields {
          key
          type
          value
        }
      }
    }
  }
`

function readEnvValue(...keys) {
  for (const key of keys) {
    const value = import.meta.env[key]?.trim()
    if (value) {
      return value
    }
  }

  return ''
}

function pickTextField(fields, keys) {
  for (const key of keys) {
    const match = fields.find((field) => field.key.toLowerCase() === key.toLowerCase())
    const value = match?.value?.trim()
    if (value) {
      return value
    }
  }

  return ''
}

function extractUrls(value) {
  if (!value) {
    return []
  }

  return value
    .split(/[\n,]+/)
    .map((entry) => entry.trim())
    .flatMap((entry) => entry.match(/https?:\/\/[^\s"']+/g) ?? [])
    .map((url) => url.replace(/[)\].,;]+$/g, ''))
    .filter(Boolean)
}

function collectUrlsFromMetaobject(metaobject) {
  const urls = []

  for (const field of metaobject.fields ?? []) {
    urls.push(...extractUrls(field.value))
  }

  return urls.filter((url, index, list) => url && list.indexOf(url) === index)
}

const LANDING_IMAGE_TYPE_CANDIDATES = [
  'LandingPageImage',
  'landing_page_image',
  'landingPageImage',
  'landingpageimage',
  'landingpage_image',
  'landing-page-image',
]

function mapLandingImage(metaobject) {
  const fields = metaobject.fields ?? []
  const urls = collectUrlsFromMetaobject(metaobject)

  return {
    id: metaobject.id,
    title: pickTextField(fields, ['title', 'name', 'heading', 'label']) || 'Landing page image',
    eyebrow: pickTextField(fields, ['eyebrow', 'kicker', 'tagline']) || 'featured image',
    subtitle: pickTextField(fields, ['subtitle', 'caption', 'description']) || 'shop backlog',
    imageSrc: urls[0] || '',
  }
}

export async function fetchLandingImage() {
  const configuredType =
    readEnvValue(
      'REACT_APP_SHOPIFY_LANDING_IMAGE_METAOBJECT_TYPE',
      'VITE_SHOPIFY_LANDING_IMAGE_METAOBJECT_TYPE',
    ) || ''

  const typesToTry = configuredType
    ? [configuredType, ...LANDING_IMAGE_TYPE_CANDIDATES]
    : LANDING_IMAGE_TYPE_CANDIDATES

  const seenTypes = new Set()
  const triedTypes = []

  for (const type of typesToTry) {
    const normalizedType = type.trim()
    if (!normalizedType || seenTypes.has(normalizedType)) {
      continue
    }

    seenTypes.add(normalizedType)
    triedTypes.push(normalizedType)

    try {
      const data = await storefrontQuery(LANDING_IMAGE_QUERY, { type: normalizedType, first: 1 })
      const node = data?.metaobjects?.nodes?.[0] ?? null
      const landingImage = node ? mapLandingImage(node) : null

      if (landingImage?.imageSrc) {
        return landingImage
      }
    } catch {
      // Try the next candidate type. Shopify throws when the metaobject type
      // does not exist or is not exposed to the storefront.
    }
  }

  const error = new Error(
    `No Shopify landing image content found. Tried: ${triedTypes.join(', ')}. Set REACT_APP_SHOPIFY_LANDING_IMAGE_METAOBJECT_TYPE to the exact metaobject type used in Shopify.`,
  )
  error.code = 'LANDING_IMAGE_NOT_FOUND'
  throw error
}

export function getLandingImageType() {
  const configuredType =
    readEnvValue(
      'REACT_APP_SHOPIFY_LANDING_IMAGE_METAOBJECT_TYPE',
      'VITE_SHOPIFY_LANDING_IMAGE_METAOBJECT_TYPE',
    ) || ''

  return configuredType || LANDING_IMAGE_TYPE_CANDIDATES[0]
}
