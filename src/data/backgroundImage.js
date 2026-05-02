import { storefrontQuery } from '../lib/shopifyStorefront.js'

const BACKGROUND_IMAGE_QUERY = `
  query BackgroundImage($type: String!, $first: Int!) {
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

  return String(value)
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

const BACKGROUND_IMAGE_TYPE_CANDIDATES = [
  'Backgrounds',
  'backgrounds',
  'background_images',
  'backgroundImage',
  'background-image',
  'background_image',
]

function mapBackgroundImage(metaobject) {
  const fields = metaobject.fields ?? []
  const urls = collectUrlsFromMetaobject(metaobject)

  return {
    id: metaobject.id,
    handle: metaobject.handle,
    title: pickTextField(fields, ['title', 'name', 'heading', 'label']) || 'bottomwear',
    alt: pickTextField(fields, ['alt', 'altText', 'image_alt', 'caption']) || 'Bottomwear preview',
    image: urls[0] || '',
  }
}

export async function fetchBackgroundImage() {
  const configuredType =
    readEnvValue(
      'REACT_APP_SHOPIFY_BACKGROUND_METAOBJECT_TYPE',
      'VITE_SHOPIFY_BACKGROUND_METAOBJECT_TYPE',
    ) || ''

  const typesToTry = configuredType
    ? [configuredType, ...BACKGROUND_IMAGE_TYPE_CANDIDATES]
    : BACKGROUND_IMAGE_TYPE_CANDIDATES

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
      const data = await storefrontQuery(BACKGROUND_IMAGE_QUERY, { type: normalizedType, first: 1 })
      const node = data?.metaobjects?.nodes?.[0] ?? null
      const backgroundImage = node ? mapBackgroundImage(node) : null

      if (backgroundImage?.image) {
        return backgroundImage
      }
    } catch {
      // Try the next candidate type. Shopify throws when the metaobject type
      // does not exist or is not exposed to the storefront.
    }
  }

  const error = new Error(
    `No Shopify background image content found. Tried: ${triedTypes.join(', ')}. Set REACT_APP_SHOPIFY_BACKGROUND_METAOBJECT_TYPE to the exact metaobject type used in Shopify.`,
  )
  error.code = 'BACKGROUND_IMAGE_NOT_FOUND'
  throw error
}

export function getBackgroundImageType() {
  const configuredType =
    readEnvValue(
      'REACT_APP_SHOPIFY_BACKGROUND_METAOBJECT_TYPE',
      'VITE_SHOPIFY_BACKGROUND_METAOBJECT_TYPE',
    ) || ''

  return configuredType || BACKGROUND_IMAGE_TYPE_CANDIDATES[0]
}
