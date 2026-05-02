import { storefrontQuery } from '../lib/shopifyStorefront.js'

const UGC_VIDEOS_QUERY = `
  query UgcVideos($type: String!, $first: Int!) {
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

const UGC_VIDEO_TYPE_CANDIDATES = [
  'UgcVideo',
  'ugc_video',
  'ugcVideo',
  'ugcvideo',
  'ugc-video',
  'ugc_videos',
  'ugc-videos',
]

function mapUgcVideo(metaobject, index) {
  const fields = metaobject.fields ?? []
  const urls = collectUrlsFromMetaobject(metaobject)
  const videoSrc = urls.find(isVideoUrl) || urls[0] || ''

  return {
    id: metaobject.id,
    title: pickTextField(fields, ['title', 'name', 'heading', 'label']) || `UGC video ${index + 1}`,
    caption: pickTextField(fields, ['caption', 'subtitle', 'description', 'eyebrow']),
    videoSrc,
  }
}

export async function fetchUgcVideos(limit = 8) {
  const configuredType =
    readEnvValue('REACT_APP_SHOPIFY_UGC_VIDEO_METAOBJECT_TYPE', 'VITE_SHOPIFY_UGC_VIDEO_METAOBJECT_TYPE') ||
    ''

  const typesToTry = configuredType ? [configuredType, ...UGC_VIDEO_TYPE_CANDIDATES] : UGC_VIDEO_TYPE_CANDIDATES
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
      const data = await storefrontQuery(UGC_VIDEOS_QUERY, { type: normalizedType, first: limit })
      const nodes = data?.metaobjects?.nodes ?? []
      const videos = nodes
        .map((node, index) => mapUgcVideo(node, index))
        .filter((video) => video.videoSrc)

      if (videos.length) {
        return videos
      }
    } catch {
      // Try the next candidate type. Shopify throws when the metaobject type
      // does not exist or is not exposed to the storefront.
    }
  }

  const error = new Error(
    `No Shopify UGC videos found. Tried: ${triedTypes.join(', ')}. Set REACT_APP_SHOPIFY_UGC_VIDEO_METAOBJECT_TYPE to the exact metaobject type used in Shopify.`,
  )
  error.code = 'UGC_VIDEOS_NOT_FOUND'
  throw error
}

export function getUgcVideoType() {
  const configuredType =
    readEnvValue('REACT_APP_SHOPIFY_UGC_VIDEO_METAOBJECT_TYPE', 'VITE_SHOPIFY_UGC_VIDEO_METAOBJECT_TYPE') ||
    ''

  return configuredType || UGC_VIDEO_TYPE_CANDIDATES[0]
}
