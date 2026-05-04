const quickLinks = [
  { label: 'Shop', href: '/products' },
  { label: 'Topwear', href: '/products' },
  { label: 'Bottomwear', href: '/products' },
]

const infoLinks = [
  { label: 'Contact Us', href: '/about' },
]

const socialLinks = [{ label: 'Instagram', href: 'https://www.instagram.com/backlog.in/', external: true }]
const brandLoop = Array.from({ length: 8 }, () => 'BACKLOG')

function LinkColumn({ title, links, onNavigate, onExternalNavigate }) {
  return (
    <section className="footer-column">
      <h2>{title}</h2>
      <ul>
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noreferrer noopener' : undefined}
              onClick={(event) => {
                if (link.external) {
                  event.preventDefault()
                  onExternalNavigate?.(link.href)
                  return
                }

                event.preventDefault()
                onNavigate?.(link.href)
              }}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function Footer({ forceVisible = false, onNavigate, onExternalNavigate } = {}) {
  return (
    <footer
      className={`site-footer${forceVisible ? ' is-visible' : ''}`}
      aria-label="Footer"
      data-motion-reveal
    >
      <div className="footer-panel">
        <LinkColumn title="Quick Links" links={quickLinks} onNavigate={onNavigate} onExternalNavigate={onExternalNavigate} />
        <LinkColumn title="Info" links={infoLinks} onNavigate={onNavigate} onExternalNavigate={onExternalNavigate} />
        <LinkColumn title="Social" links={socialLinks} onNavigate={onNavigate} onExternalNavigate={onExternalNavigate} />
      </div>

      <div className="footer-brand-band" aria-hidden="true">
        <div className="footer-brand-band__track">
          <div className="footer-brand-band__group">
            {brandLoop.map((word, index) => (
              <span key={`brand-a-${index}`}>{word}</span>
            ))}
          </div>
          <div className="footer-brand-band__group" aria-hidden="true">
            {brandLoop.map((word, index) => (
              <span key={`brand-b-${index}`}>{word}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-copyright">
        <p>&copy; {new Date().getFullYear()} BACKLOG</p>
      </div>
    </footer>
  )
}
