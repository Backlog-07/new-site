const DEFAULT_NEWSLETTER_ENDPOINT = '/api/newsletter/subscribe'

export async function subscribeNewsletter(email) {
  const endpoint =
    import.meta.env.VITE_NEWSLETTER_SUBSCRIBE_ENDPOINT?.trim() || DEFAULT_NEWSLETTER_ENDPOINT

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })

  let payload = null

  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok) {
    throw new Error(payload?.message || 'Unable to subscribe right now.')
  }

  return payload
}
