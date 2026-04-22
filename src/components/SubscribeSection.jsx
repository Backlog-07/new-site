import { useState } from 'react'
import { subscribeNewsletter } from '../lib/newsletterSubscribe.js'

export function SubscribeSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setStatus('error')
      setMessage('Please enter an email address.')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      await subscribeNewsletter(trimmedEmail)
      setStatus('success')
      setMessage('You are on the list.')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Unable to subscribe right now.')
    }
  }

  return (
    <section className="subscribe-section" aria-label="Newsletter subscribe" data-motion-reveal>
      <div className="subscribe-section__inner">
        <div className="subscribe-section__copy">
          <p className="subscribe-section__kicker" data-motion-reveal data-motion-parallax="0.9">
            Newsletter
          </p>
          <h2 data-motion-reveal data-motion-parallax="0.82">Join the list.</h2>
          <p className="subscribe-section__support" data-motion-reveal>
            Get product drops and store updates straight to your inbox.
          </p>
          <div
            className="subscribe-section__features"
            aria-label="Newsletter benefits"
            data-motion-reveal
          >
            <span>Early access</span>
            <span>Restock alerts</span>
            <span>Private drops</span>
          </div>
        </div>

        <div className="subscribe-section__panel" data-motion-reveal data-motion-parallax="0.98">
          <form className="subscribe-section__form" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="subscribe-email">
              Your E-mail
            </label>
            <input
              id="subscribe-email"
              type="email"
              name="email"
              placeholder="Email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={status === 'loading'}
            />
            <button className="motion-float" type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'SUBSCRIBING' : 'SUBSCRIBE'}
            </button>
            <p
              className={`subscribe-section__status subscribe-section__status--${status}`}
              role="status"
              aria-live="polite"
            >
              {message}
            </p>
          </form>
          <p className="subscribe-section__fineprint">
            One clean email a week. No clutter, just the good stuff.
          </p>
        </div>
      </div>
    </section>
  )
}
