import { useState } from 'react'

export function PrimaryHeader({
  cartCount = 0,
  onCartOpen,
  onHomeOpen,
  onWorldOpen,
  onAboutOpen,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  function closeMobileMenu() {
    setMobileMenuOpen(false)
  }

  return (
    <>
    <div className="header-primary">
      <a
        className="header-shop-link"
        href="#collection"
        onClick={(event) => {
          event.preventDefault()
          onHomeOpen?.()
        }}
      >
        shop
      </a>

      <a
        className="header-logo"
        href="#top"
        aria-label="Backlog Store home"
        onClick={(event) => {
          event.preventDefault()
          onHomeOpen?.()
        }}
      >
        Backlog Store
      </a>

      <div className="header-utilities" aria-label="Account and search">
        <button type="button" className="header-link-button" onClick={onWorldOpen}>
          world
        </button>
        <button type="button" className="header-link-button" onClick={onAboutOpen}>
          about
        </button>
        <button type="button" className="header-bag-button" onClick={onCartOpen}>
          bag ({cartCount})
        </button>
      </div>

      <button
        type="button"
        className="header-menu-button"
        onClick={() => setMobileMenuOpen((current) => !current)}
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-site-menu"
        aria-label="Open navigation menu"
      >
        <span aria-hidden="true" className="header-menu-button__line" />
        <span aria-hidden="true" className="header-menu-button__line" />
        <span aria-hidden="true" className="header-menu-button__line" />
      </button>

      <button type="button" className="header-mobile-bag" onClick={onCartOpen}>
        bag ({cartCount})
      </button>
    </div>
    <div className={`header-mobile-menu${mobileMenuOpen ? ' is-open' : ''}`} id="mobile-site-menu">
      <button
        type="button"
        className="header-mobile-menu__link"
        onClick={(event) => {
          event.preventDefault()
          closeMobileMenu()
          onHomeOpen?.()
        }}
      >
        shop
      </button>
      <button
        type="button"
        className="header-mobile-menu__link"
        onClick={(event) => {
          event.preventDefault()
          closeMobileMenu()
          onWorldOpen?.()
        }}
      >
        world
      </button>
      <button
        type="button"
        className="header-mobile-menu__link"
        onClick={(event) => {
          event.preventDefault()
          closeMobileMenu()
          onAboutOpen?.()
        }}
      >
        about
      </button>
      <button
        type="button"
        className="header-mobile-menu__link"
        onClick={(event) => {
          event.preventDefault()
          closeMobileMenu()
          onCartOpen?.()
        }}
      >
        bag
      </button>
    </div>
    </>
  )
}
