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

function MobileLinkGroup({ title, links, className = '', onAboutOpen }) {
  return (
    <section className={`footer-mobile__col ${className}`.trim()}>
      <h2 className="footer-mobile__col-title">{title}</h2>
      <ul className="footer-mobile__list">
        {links.map((link) => {
          const isAboutLink = link === 'About Us'

          return (
            <li key={link}>
              {isAboutLink ? (
                <button
                  type="button"
                  className="footer-mobile__link-button"
                  onClick={onAboutOpen}
                >
                  {link}
                </button>
              ) : (
                <a href="#top">{link}</a>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export function Footer({ onAboutOpen }) {
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
            Read more <span aria-hidden="true">-&gt;</span>
          </a>
        </section>
      </div>

      <div className="footer-mobile">
        <p className="footer-mobile__wordmark">BACKLOG</p>

        <div className="footer-mobile__grid">
          <MobileLinkGroup
            title="About Us"
            links={['About Us', 'Careers', 'Sustainability', 'Press']}
            onAboutOpen={onAboutOpen}
          />
          <MobileLinkGroup
            title="Support"
            className="footer-mobile__col--wide"
            links={[
              'Make a return/Exchange',
              'Refund/Exchange policy',
              'Track your order',
              'Shipping policy',
              "FAQ's",
              'Terms',
            ]}
          />
        </div>

        <p className="footer-mobile__copy">
          &copy; {new Date().getFullYear()} Backlog Retail Private Limited, All rights reserved
        </p>
      </div>

      <p className="footer-note">
        Backlog is built for everyday wear, thoughtful details, and a cleaner way to shop the collection.
      </p>
    </footer>
  )
}
