import { PrimaryHeader } from './PrimaryHeader.jsx'

export function Header({
  cartCount = 0,
  onCartOpen,
  onHomeOpen,
  onWorldOpen,
  onAboutOpen,
}) {
  return (
    <header className="site-header">
      <div className="header-shell">
        <PrimaryHeader
          cartCount={cartCount}
          onCartOpen={onCartOpen}
          onHomeOpen={onHomeOpen}
          onWorldOpen={onWorldOpen}
          onAboutOpen={onAboutOpen}
        />
      </div>
    </header>
  )
}
