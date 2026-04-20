import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distDir = path.join(__dirname, 'dist')

function loadLocalEnv() {
  const envPath = path.join(__dirname, '.env')
  if (!existsSync(envPath)) {
    return {}
  }

  const raw = readFileSync(envPath, 'utf8')
  const env = {}

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }

    const separatorIndex = trimmed.indexOf('=')
    if (separatorIndex < 0) {
      continue
    }

    const key = trimmed.slice(0, separatorIndex).trim()
    const value = trimmed.slice(separatorIndex + 1).trim()
    if (key) {
      env[key] = value
    }
  }

  return env
}

const fileEnv = loadLocalEnv()
const env = {
  ...fileEnv,
  ...process.env,
}

const storeDomain =
  env.SHOPIFY_STORE_DOMAIN?.trim() ||
  env.VITE_SHOPIFY_STORE_DOMAIN?.trim() ||
  env.REACT_APP_SHOPIFY_DOMAIN?.trim()
const adminToken = env.SHOPIFY_ADMIN_ACCESS_TOKEN?.trim()
const apiVersion = env.SHOPIFY_API_VERSION?.trim() || env.VITE_SHOPIFY_API_VERSION?.trim() || '2025-07'

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

async function readRequestBody(req) {
  const chunks = []
  for await (const chunk of req) {
    chunks.push(chunk)
  }

  if (!chunks.length) {
    return {}
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

async function requestShopify(query, variables) {
  if (!storeDomain || !adminToken) {
    throw new Error('Shopify admin credentials are not configured.')
  }

  const response = await fetch(`https://${storeDomain}/admin/api/${apiVersion}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': adminToken,
    },
    body: JSON.stringify({ query, variables }),
  })

  const payload = await response.json()
  return { response, payload }
}

async function handleNewsletterSubscribe(req, res) {
  try {
    const body = await readRequestBody(req)
    const email = typeof body.email === 'string' ? body.email.trim() : ''

    if (!email) {
      sendJson(res, 400, { message: 'Email is required.' })
      return
    }

    if (!storeDomain || !adminToken) {
      sendJson(res, 200, { ok: true, mode: 'local' })
      return
    }

    const consent = {
      marketingState: 'SUBSCRIBED',
      marketingOptInLevel: 'SINGLE_OPT_IN',
      consentUpdatedAt: new Date().toISOString(),
    }

    const findCustomerQuery = `
      query CustomerByEmail($query: String!) {
        customers(first: 1, query: $query) {
          nodes {
            id
          }
        }
      }
    `

    const createCustomerMutation = `
      mutation CustomerCreate($input: CustomerInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const updateConsentMutation = `
      mutation UpdateEmailMarketingConsent($input: CustomerEmailMarketingConsentUpdateInput!) {
        customerEmailMarketingConsentUpdate(input: $input) {
          customer {
            id
            email
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const lookup = await requestShopify(findCustomerQuery, {
      query: `email:"${email.replaceAll('"', '\\"')}"`,
    })

    if (!lookup.response.ok || lookup.payload.errors) {
      throw new Error(
        lookup.payload?.errors?.[0]?.message || `Shopify lookup failed with status ${lookup.response.status}.`,
      )
    }

    const existingCustomerId = lookup.payload?.data?.customers?.nodes?.[0]?.id || ''
    const shopifyResult = existingCustomerId
      ? await requestShopify(updateConsentMutation, {
          input: {
            customerId: existingCustomerId,
            emailMarketingConsent: consent,
          },
        })
      : await requestShopify(createCustomerMutation, {
          input: {
            email,
            emailMarketingConsent: consent,
          },
        })

    const result =
      shopifyResult.payload?.data?.customerEmailMarketingConsentUpdate ||
      shopifyResult.payload?.data?.customerCreate

    const userErrors =
      result?.userErrors ||
      result?.customerUserErrors ||
      shopifyResult.payload?.errors ||
      []

    if (userErrors.length) {
      sendJson(res, 400, { message: userErrors[0]?.message || 'Shopify rejected the subscription.' })
      return
    }

    sendJson(res, 200, { ok: true })
  } catch (error) {
    sendJson(res, 500, {
      message: error instanceof Error ? error.message : 'Unable to subscribe right now.',
    })
  }
}

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
}

async function serveStatic(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405
    res.end('Method Not Allowed')
    return
  }

  const requestUrl = new URL(req.url || '/', 'http://localhost')
  let pathname = decodeURIComponent(requestUrl.pathname)
  if (pathname === '/') {
    pathname = '/index.html'
  }

  let filePath = path.join(distDir, pathname)

  try {
    const fileStats = await stat(filePath)
    if (fileStats.isDirectory()) {
      filePath = path.join(filePath, 'index.html')
    }
  } catch {
    filePath = path.join(distDir, 'index.html')
  }

  try {
    const content = await readFile(filePath)
    const ext = path.extname(filePath)
    res.statusCode = 200
    res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream')
    res.end(req.method === 'HEAD' ? undefined : content)
  } catch {
    res.statusCode = 404
    res.end('Not Found')
  }
}

const port = Number(env.PORT || 4173)

createServer(async (req, res) => {
  if (req.url === '/api/newsletter/subscribe' && req.method === 'POST') {
    await handleNewsletterSubscribe(req, res)
    return
  }

  await serveStatic(req, res)
}).listen(port, () => {
  console.log(`Backlog server listening on http://localhost:${port}`)
})
