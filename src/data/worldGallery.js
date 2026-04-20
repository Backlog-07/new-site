import { storefrontQuery } from '../lib/shopifyStorefront.js'

const WORLD_GALLERY_QUERY = `
  query WorldGallery($type: String!, $first: Int!) {
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

function isImageField(field) {
  return /image|images|gallery|thumb|thumbnail|slide|cover|hero|banner|frame/i.test(field.key)
}

function collectImages(fields, fallbackAlt) {
  const images = []

  for (const field of fields ?? []) {
    const urls = extractUrls(field.value)
    if (!urls.length) {
      continue
    }

    const weightedUrls = isImageField(field) ? urls : urls.slice()
    for (const url of weightedUrls) {
      images.push({
        src: url,
        alt: fallbackAlt,
      })
    }
  }

  return images.filter(
    (image, index, list) => image.src && list.findIndex((entry) => entry.src === image.src) === index,
  )
}

function collectUrlsFromMetaobject(metaobject) {
  const urls = []

  for (const field of metaobject.fields ?? []) {
    urls.push(...extractUrls(field.value))
  }

  return urls.filter((url, index, list) => url && list.indexOf(url) === index)
}

const WORLD_TYPE_CANDIDATES = [
  'URL',
  'World-Image',
  'world-image',
  'world_image',
  'world_gallery',
  'world',
  'lookbook',
  'campaign_gallery',
  'content_section',
  'editorial_gallery',
  'gallery',
]

function mapWorldSlide(metaobject, index) {
  const fields = metaobject.fields ?? []
  const title =
    pickTextField(fields, ['title', 'name', 'heading', 'label']) ||
    `World image ${index + 1}`
  const subtitle = pickTextField(fields, ['subtitle', 'caption', 'description', 'eyebrow'])
  const urls = collectUrlsFromMetaobject(metaobject)
  const images = collectImages(fields, title)

  if (!images.length && urls.length) {
    images.push(
      ...urls.map((src) => ({
        src,
        alt: title,
      })),
    )
  }

  return {
    id: metaobject.id,
    title,
    subtitle,
    image: images[0] ?? null,
    thumbnails: images.slice(1),
    images,
  }
}

export async function fetchWorldGallery(limit = 12) {
  const configuredType =
    readEnvValue('REACT_APP_SHOPIFY_WORLD_METAOBJECT_TYPE', 'VITE_SHOPIFY_WORLD_METAOBJECT_TYPE') || ''

  const typesToTry = configuredType ? [configuredType, ...WORLD_TYPE_CANDIDATES] : WORLD_TYPE_CANDIDATES
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
      const data = await storefrontQuery(WORLD_GALLERY_QUERY, { type: normalizedType, first: limit })
      const nodes = data?.metaobjects?.nodes ?? []
      const slides = nodes.map((node, index) => mapWorldSlide(node, index)).filter((slide) => slide.image)

      if (slides.length) {
        return slides
      }
    } catch {
      // Try the next candidate type. Shopify throws when the metaobject type
      // does not exist or is not exposed to the storefront.
    }
  }

  const error = new Error(
    `No Shopify world content found. Tried: ${triedTypes.join(', ')}. Set REACT_APP_SHOPIFY_WORLD_METAOBJECT_TYPE to the exact metaobject type used in Shopify.`,
  )
  error.code = 'WORLD_CONTENT_NOT_FOUND'
  throw error
}

export function getWorldGalleryType() {
  const configuredType =
    readEnvValue('REACT_APP_SHOPIFY_WORLD_METAOBJECT_TYPE', 'VITE_SHOPIFY_WORLD_METAOBJECT_TYPE') || ''

  return configuredType || WORLD_TYPE_CANDIDATES[0]
}
