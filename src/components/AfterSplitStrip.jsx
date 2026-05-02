function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" role="presentation" focusable="false" aria-hidden="true">
      <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" />
    </svg>
  )
}

function StitchIcon() {
  return (
    <svg viewBox="0 0 24 24" role="presentation" focusable="false" aria-hidden="true">
      <path d="M6 4v16" />
      <path d="M10 4v16" />
      <path d="M14 4v16" />
      <path d="M18 4v16" />
    </svg>
  )
}

function CareIcon() {
  return (
    <svg viewBox="0 0 24 24" role="presentation" focusable="false" aria-hidden="true">
      <path d="M12 21s7-4.4 7-10.4A4.6 4.6 0 0 0 14.4 6c-1.3 0-2.7.7-3.4 1.9A4.1 4.1 0 0 0 7.6 6 4.6 4.6 0 0 0 5 10.6C5 16.6 12 21 12 21z" />
    </svg>
  )
}

function InfoBadge({ icon: Icon, title, description, order }) {
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

export function AfterSplitStrip() {
  return (
    <section
      className="service-strip service-strip--trust service-strip--border"
      aria-label="Additional highlights"
      data-motion-reveal
    >
      <div className="service-trust-grid">
        <InfoBadge order={1} icon={SparkIcon} title="Fresh edits" description="A new section for future content" />
        <InfoBadge order={2} icon={StitchIcon} title="Product notes" description="Room to add more information" />
        <InfoBadge order={3} icon={CareIcon} title="Keep exploring" description="We can swap this content next" />
      </div>
    </section>
  )
}
