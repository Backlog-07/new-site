import { storefrontQuery } from '../lib/shopifyStorefront.js'

const CATEGORY_SPLIT_QUERY = `
  query CategorySplit($type: String!, $first: Int!) {
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

const CATEGORY_SPLIT_TYPE_CANDIDATES = [
  'TopwearBottomwear',
  'topwear_bottomwear',
  'topwear-bottomwear',
  'topwearBottomwear',
  'topwearbottomwear',
  'category_split',
  'category-split',
  'categorySplit',
]

function mapCategoryTile(metaobject, index) {
  const fields = metaobject.fields ?? []
  const urls = collectUrlsFromMetaobject(metaobject)

  return {
    id: metaobject.id,
    handle: metaobject.handle,
    title:
      pickTextField(fields, ['title', 'name', 'heading', 'label']) ||
      (index === 0 ? 'topwear' : 'bottomwear'),
    image: urls[0] || '',
    alt:
      pickTextField(fields, ['alt', 'altText', 'image_alt', 'caption']) ||
      (index === 0 ? 'Topwear preview' : 'Bottomwear preview'),
  }
}

export async function fetchCategorySplit(limit = 2) {
  const configuredType =
    readEnvValue(
      'REACT_APP_SHOPIFY_CATEGORY_SPLIT_METAOBJECT_TYPE',
      'VITE_SHOPIFY_CATEGORY_SPLIT_METAOBJECT_TYPE',
    ) || ''

  const typesToTry = configuredType
    ? [configuredType, ...CATEGORY_SPLIT_TYPE_CANDIDATES]
    : CATEGORY_SPLIT_TYPE_CANDIDATES

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
      const data = await storefrontQuery(CATEGORY_SPLIT_QUERY, { type: normalizedType, first: limit })
      const nodes = data?.metaobjects?.nodes ?? []
      const tiles = nodes
        .map((node, index) => mapCategoryTile(node, index))
        .filter((tile) => tile.image)

      if (tiles.length) {
        return tiles.slice(0, limit)
      }
    } catch {
      // Try the next candidate type. Shopify throws when the metaobject type
      // does not exist or is not exposed to the storefront.
    }
  }

  const error = new Error(
    `No Shopify category split content found. Tried: ${triedTypes.join(', ')}. Set REACT_APP_SHOPIFY_CATEGORY_SPLIT_METAOBJECT_TYPE to the exact metaobject type used in Shopify.`,
  )
  error.code = 'CATEGORY_SPLIT_NOT_FOUND'
  throw error
}

export function getCategorySplitType() {
  const configuredType =
    readEnvValue(
      'REACT_APP_SHOPIFY_CATEGORY_SPLIT_METAOBJECT_TYPE',
      'VITE_SHOPIFY_CATEGORY_SPLIT_METAOBJECT_TYPE',
    ) || ''

  return configuredType || CATEGORY_SPLIT_TYPE_CANDIDATES[0]
}
