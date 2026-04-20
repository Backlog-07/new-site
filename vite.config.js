import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { Buffer } from 'node:buffer'
import process from 'node:process'

function newsletterApiPlugin(env) {
  const storeDomain = env.SHOPIFY_STORE_DOMAIN?.trim() || env.VITE_SHOPIFY_STORE_DOMAIN?.trim() || env.REACT_APP_SHOPIFY_DOMAIN?.trim()
  const adminToken = env.SHOPIFY_ADMIN_ACCESS_TOKEN?.trim()
  const apiVersion = env.SHOPIFY_API_VERSION?.trim() || env.VITE_SHOPIFY_API_VERSION?.trim() || '2025-07'

  async function handleSubscribeRequest(req, res) {
    const chunks = []
    for await (const chunk of req) {
      chunks.push(chunk)
    }

    let body = {}
    try {
      body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {}
    } catch {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ message: 'Invalid JSON payload.' }))
      return
    }

    const email = typeof body.email === 'string' ? body.email.trim() : ''
    if (!email) {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ message: 'Email is required.' }))
      return
    }

    if (!storeDomain || !adminToken) {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ ok: true, mode: 'local' }))
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

    const requestJson = async (query, variables) => {
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

    try {
      const customerLookup = await requestJson(findCustomerQuery, {
        query: `email:"${email.replaceAll('"', '\\"')}"`,
      })

      if (!customerLookup.response.ok || customerLookup.payload.errors) {
        throw new Error(
          customerLookup.payload?.errors?.[0]?.message ||
            `Shopify lookup failed with status ${customerLookup.response.status}.`,
        )
      }

      const existingCustomerId = customerLookup.payload?.data?.customers?.nodes?.[0]?.id || ''
      const shopifyResult = existingCustomerId
        ? await requestJson(updateConsentMutation, {
            input: {
              customerId: existingCustomerId,
              emailMarketingConsent: consent,
            },
          })
        : await requestJson(createCustomerMutation, {
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
        const message = userErrors[0]?.message || 'Shopify rejected the subscription.'
        res.statusCode = 400
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ message }))
        return
      }

      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ ok: true }))
    } catch (error) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.end(
        JSON.stringify({
          message: error instanceof Error ? error.message : 'Unable to subscribe right now.',
        }),
      )
    }
  }

  return {
    name: 'shopify-newsletter-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== 'POST' || req.url !== '/api/newsletter/subscribe') {
          next()
          return
        }

        await handleSubscribeRequest(req, res)
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== 'POST' || req.url !== '/api/newsletter/subscribe') {
          next()
          return
        }

        await handleSubscribeRequest(req, res)
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), newsletterApiPlugin(env)],
    envPrefix: ['VITE_', 'REACT_APP_'],
  }
})
