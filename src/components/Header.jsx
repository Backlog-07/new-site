import { PrimaryHeader } from './PrimaryHeader.jsx'

export function Header({
  cartCount = 0,
  onCartOpen,
  onHomeOpen,
  onShopOpen,
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
          onShopOpen={onShopOpen}
          onWorldOpen={onWorldOpen}
          onAboutOpen={onAboutOpen}
        />
      </div>
    </header>
  )
}
