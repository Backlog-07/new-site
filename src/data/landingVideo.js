import { storefrontQuery } from '../lib/shopifyStorefront.js'

const LANDING_VIDEO_QUERY = `
  query LandingVideo($type: String!, $first: Int!) {
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

const LANDING_TYPE_CANDIDATES = [
  'LandingPageVideo',
  'landing_page_video',
  'landingPageVideo',
  'landingpagevideo',
  'landingpage_video',
  'landing-page-video',
]

function collectUrlsFromMetaobject(metaobject) {
  const urls = []

  for (const field of metaobject.fields ?? []) {
    urls.push(...extractUrls(field.value))
  }

  return urls.filter((url, index, list) => url && list.indexOf(url) === index)
}

function isVideoUrl(url) {
  return /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(url)
}

function mapLandingVideo(metaobject) {
  const fields = metaobject.fields ?? []
  const urls = collectUrlsFromMetaobject(metaobject)
  const mediaUrl = urls[0] || ''

  return {
    id: metaobject.id,
    title: pickTextField(fields, ['title', 'name', 'heading', 'label']) || 'AW25',
    eyebrow: pickTextField(fields, ['eyebrow', 'kicker', 'tagline']) || 'featured film',
    subtitle:
      pickTextField(fields, ['subtitle', 'caption', 'description']) || 'entire studios',
    mediaSrc: mediaUrl,
    mediaKind: mediaUrl ? (isVideoUrl(mediaUrl) ? 'video' : 'image') : '',
  }
}

export async function fetchLandingVideo() {
  const configuredType =
    readEnvValue('REACT_APP_SHOPIFY_LANDING_VIDEO_METAOBJECT_TYPE', 'VITE_SHOPIFY_LANDING_VIDEO_METAOBJECT_TYPE') ||
    ''

  const typesToTry = configuredType
    ? [configuredType, ...LANDING_TYPE_CANDIDATES]
    : LANDING_TYPE_CANDIDATES

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
      const data = await storefrontQuery(LANDING_VIDEO_QUERY, { type: normalizedType, first: 1 })
      const node = data?.metaobjects?.nodes?.[0] ?? null
      const landingVideo = node ? mapLandingVideo(node) : null

      if (landingVideo?.mediaSrc) {
        return landingVideo
      }
    } catch {
      // Try the next candidate type. Shopify throws when the metaobject type
      // does not exist or is not exposed to the storefront.
    }
  }

  const error = new Error(
    `No Shopify landing video content found. Tried: ${triedTypes.join(', ')}. Set REACT_APP_SHOPIFY_LANDING_VIDEO_METAOBJECT_TYPE to the exact metaobject type used in Shopify.`,
  )
  error.code = 'LANDING_VIDEO_NOT_FOUND'
  throw error
}

export function getLandingVideoType() {
  const configuredType =
    readEnvValue('REACT_APP_SHOPIFY_LANDING_VIDEO_METAOBJECT_TYPE', 'VITE_SHOPIFY_LANDING_VIDEO_METAOBJECT_TYPE') ||
    ''

  return configuredType || LANDING_TYPE_CANDIDATES[0]
}
