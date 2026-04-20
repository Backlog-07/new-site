const shopLinks = ['Women', 'Divided', 'Men', 'Kids', 'H&M Home', 'Unidays']

const corporateLinks = [
  'Career at Backlog',
  'About Backlog',
  'Sustainability',
  'Press',
  'Investor Relations',
  'Corporate Governance',
]

const helpLinks = [
  'Customer Service',
  'My Account',
  'Find a Store',
  'Legal & Privacy',
  'Contact',
  'Gift Card',
  'CA Supply Chains Act',
]

function LinkColumn({ title, links }) {
  return (
    <section className="footer-column">
      <h2>{title}</h2>
      <ul>
        {links.map((link) => (
          <li key={link}>
            <a href="#top">{link}</a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="site-footer" aria-label="Footer">
      {/* Full desktop panel */}
      <div className="footer-panel">
        <LinkColumn title="Shop" links={shopLinks} />
        <LinkColumn title="Corporate Info" links={corporateLinks} />
        <LinkColumn title="Help" links={helpLinks} />

        <section className="footer-member">
          <h2>Become a member</h2>
          <p>Join now and get 10% off your next purchase.</p>
          <a href="#top" className="footer-member-link">
            Read more <span aria-hidden="true">→</span>
          </a>
        </section>
      </div>

      {/* Mobile-only minimal footer */}
      <div className="footer-mobile">
        <p className="footer-mobile__wordmark">BACKLOG</p>
        <p className="footer-mobile__tagline">
          Everyday wear. Thoughtful details.
        </p>

        <div className="footer-mobile__links">
          <div className="footer-mobile__col">
            <p className="footer-mobile__col-title">Shop</p>
            <a href="#top">New arrivals</a>
            <a href="#top">All products</a>
            <a href="#top">Gift card</a>
          </div>
          <div className="footer-mobile__col">
            <p className="footer-mobile__col-title">Info</p>
            <a href="#top">About Backlog</a>
            <a href="#top">Contact</a>
            <a href="#top">Legal & Privacy</a>
          </div>
        </div>

        <div className="footer-mobile__divider" />
        <p className="footer-mobile__copy">© {new Date().getFullYear()} Backlog. All rights reserved.</p>
      </div>

      <p className="footer-note">
        Backlog is built for everyday wear, thoughtful details, and a cleaner way to shop the collection.
      </p>
    </footer>
  )
}
