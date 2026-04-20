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

      <p className="footer-note">
        Backlog is built for everyday wear, thoughtful details, and a cleaner way to shop the collection.
      </p>
    </footer>
  )
}
