import productImage from '../assets/BACKLOG (4).png'

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

function MobileLinkGroup({ title, links, className = '' }) {
  return (
    <section className={`footer-mobile__col ${className}`.trim()}>
      <h2 className="footer-mobile__col-title">{title}</h2>
      <ul className="footer-mobile__list">
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
            Read more <span aria-hidden="true">-&gt;</span>
          </a>
        </section>
      </div>

      <div className="footer-mobile">
        <div className="footer-mobile__chrome" aria-hidden="true">
          <span className="footer-mobile__chip">
            <span className="footer-mobile__chip-plus">+</span>
            <span>BACKLOG</span>
          </span>
          <span className="footer-mobile__bookmark" />
        </div>

        <p className="footer-mobile__wordmark">Backlog</p>

        <div className="footer-mobile__grid">
          <MobileLinkGroup
            title="Connect with us"
            links={['Call', 'Text (WhatsApp)', 'Instagram', 'YouTube', 'LinkedIn']}
          />
          <MobileLinkGroup
            title="We are BACKLOG"
            links={['Our story', 'Walk-in Stores', 'Collaborations', 'Careers', 'Media', 'Blogs']}
          />
          <MobileLinkGroup
            title="Order Support"
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

        <div className="footer-mobile__visual" aria-hidden="true">
          <img src={productImage} alt="" className="footer-mobile__visual-image" />
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
