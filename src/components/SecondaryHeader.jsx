import { BrandMark } from './BrandMark.jsx'

const links = [
  'all',
  'new arrivals',
  'tops',
  'bottoms',
  'outerwear',
  'accessories',
  'shoes',
  'd4t',
  'womens',
  'training',
  'uniform',
  'z.n.e.',
]

export function SecondaryHeader() {
  return (
    <div className="header-secondary">
      <div className="header-secondary-left">
        <BrandMark />
        <a className="header-secondary-brand" href="#top">
          Backlog Store
        </a>
      </div>

      <nav className="header-secondary-nav" aria-label="Sections">
        {links.map((link) => (
          <a key={link} href="#collection">
            {link}
          </a>
        ))}
      </nav>

      <div className="header-secondary-right">
        <a href="#filters">filter & sort</a>
        <div className="header-grid-toggle" aria-label="Grid mode">
          <span>grid:</span>
          <a className="active" href="#model">
            model
          </a>
          <span>/</span>
          <a href="#item">item</a>
        </div>
      </div>
    </div>
  )
}
