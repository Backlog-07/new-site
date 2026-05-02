function ShippingIcon() {
  return (
    <svg viewBox="0 0 24 24" role="presentation" focusable="false" aria-hidden="true">
      <path d="M3 7h14l2 6H8" />
      <path d="M3 7l1.5 10H15" />
      <path d="M7.5 17.5h0" />
      <circle cx="7.5" cy="18.5" r="1.25" />
      <path d="M17 13.5h3.5l.5 4H17" />
    </svg>
  )
}

function ReturnIcon() {
  return (
    <svg viewBox="0 0 24 24" role="presentation" focusable="false" aria-hidden="true">
      <path d="M10 7 5 12l5 5" />
      <path d="M6 12h8.5a4.5 4.5 0 0 1 0 9H11" />
    </svg>
  )
}

function SecureIcon() {
  return (
    <svg viewBox="0 0 24 24" role="presentation" focusable="false" aria-hidden="true">
      <path d="M7 10V6.5A5.5 5.5 0 0 1 12.5 1h1A5.5 5.5 0 0 1 19 6.5V10" />
      <path d="M4 10h16v10H4z" />
      <path d="M12 13.5v3" />
    </svg>
  )
}

function TrustBadge({ icon: Icon, title, description, order }) {
  return (
    <article className="service-trust-item" data-motion-reveal data-motion-parallax="0.96">
      <span className="service-trust-item__icon" aria-hidden="true">
        <Icon />
      </span>
      <span className="service-trust-item__order" aria-hidden="true">
        {String(order).padStart(2, '0')}
      </span>
      <div className="service-trust-item__copy">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </article>
  )
}

export function ServiceStrip() {
  return (
    <section className="service-strip service-strip--trust" aria-label="Store benefits" data-motion-reveal>
      <div className="service-trust-grid">
        <TrustBadge order={1} icon={ShippingIcon} title="Free shipping" description="On all orders" />
        <TrustBadge
          order={2}
          icon={ReturnIcon}
          title="No return, only exchange"
          description="On full priced items only"
        />
        <TrustBadge
          order={3}
          icon={SecureIcon}
          title="Payment secure"
          description="Guaranteed payment protection"
        />
      </div>
    </section>
  )
}
