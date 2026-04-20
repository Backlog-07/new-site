const DEFAULT_API_VERSION = '2025-07'

function readEnvValue(...keys) {
  for (const key of keys) {
    const value = import.meta.env[key]?.trim()
    if (value) {
      return value
    }
  }

  return ''
}

export function getShopifyConfig() {
  return {
    storeDomain: readEnvValue('VITE_SHOPIFY_STORE_DOMAIN', 'REACT_APP_SHOPIFY_DOMAIN'),
    storefrontToken: readEnvValue(
      'VITE_SHOPIFY_STOREFRONT_PUBLIC_TOKEN',
      'REACT_APP_SHOPIFY_STOREFRONT_TOKEN',
    ),
    apiVersion: readEnvValue('VITE_SHOPIFY_API_VERSION') || DEFAULT_API_VERSION,
  }
}

export function hasShopifyStorefrontConfig() {
  const { storeDomain, storefrontToken } = getShopifyConfig()
  return Boolean(storeDomain && storefrontToken)
}

export async function storefrontQuery(query, variables = {}) {
  const { storeDomain, storefrontToken, apiVersion } = getShopifyConfig()

  if (!storeDomain || !storefrontToken) {
    throw new Error('Shopify Storefront API credentials are missing.')
  }

  const response = await fetch(`https://${storeDomain}/api/${apiVersion}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontToken,
    },
    body: JSON.stringify({ query, variables }),
  })

  const payload = await response.json()

  if (!response.ok || payload.errors) {
    const message =
      payload?.errors?.[0]?.message ||
      `Shopify request failed with status ${response.status}.`
    throw new Error(message)
  }

  return payload.data
}
