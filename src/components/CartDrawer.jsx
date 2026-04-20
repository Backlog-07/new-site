function formatMoney(money) {
  if (!money) return ''
  const amount = Number(money.amount)

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: money.currencyCode,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0)
}

function CartLine({ line, onIncrease, onDecrease, disabled = false }) {
  const merchandise = line.merchandise
  const image = merchandise?.image?.url || merchandise?.product?.featuredImage?.url
  const title = merchandise?.product?.title || merchandise?.title || 'Product'
  const variantLabel = merchandise?.selectedOptions
    ?.find((option) => option.name.toLowerCase() === 'size')
    ?.value

  return (
    <article className="cart-line">
      <div className="cart-line-image">
        {image ? <img src={image} alt={title} /> : null}
      </div>
      <div className="cart-line-copy">
        <h3>{title}</h3>
        {variantLabel ? <p>{variantLabel}</p> : null}
        <div className="cart-line-meta">
          <span>{formatMoney(merchandise?.price)}</span>
          <div className="cart-line-quantity" aria-label={`${title} quantity controls`}>
            <button
              type="button"
              className="cart-qty-button"
              onClick={onDecrease}
              disabled={disabled}
              aria-label={`Decrease quantity for ${title}`}
            >
              -
            </button>
            <span className="cart-qty-value" aria-live="polite">
              {line.quantity}
            </span>
            <button
              type="button"
              className="cart-qty-button"
              onClick={onIncrease}
              disabled={disabled}
              aria-label={`Increase quantity for ${title}`}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export function CartDrawer({ cart, isOpen, onClose, onCheckout, onUpdateQuantity, updating = false }) {
  function handleClose(event) {
    event?.stopPropagation?.()
    onClose?.()
  }

  return (
    <>
      <button
        type="button"
        className={`cart-backdrop${isOpen ? ' is-open' : ''}`}
        onClick={handleClose}
        aria-label="Close cart"
      />

      <aside
        className={`cart-drawer${isOpen ? ' is-open' : ''}`}
        aria-label="Shopping cart"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="cart-drawer-header">
          <div>
            <p className="cart-kicker">shopping bag</p>
            <h2>Cart {cart?.totalQuantity ? `(${cart.totalQuantity})` : '(0)'}</h2>
          </div>
          <button type="button" className="cart-close" onClick={handleClose}>
            close
          </button>
        </div>

        <div className="cart-drawer-body">
          {cart?.lines?.nodes?.length ? (
            cart.lines.nodes.map((line) => (
              <CartLine
                key={line.id}
                line={line}
                disabled={updating}
                onIncrease={() => onUpdateQuantity?.(line.id, line.quantity + 1)}
                onDecrease={() => onUpdateQuantity?.(line.id, line.quantity - 1)}
              />
            ))
          ) : (
            <div className="cart-empty">
              <h3>Your cart is empty</h3>
              <p>Add a size and press add to cart to start a checkout session.</p>
            </div>
          )}
        </div>

        <div className="cart-drawer-footer">
          <div className="cart-totals">
            <span>subtotal</span>
            <strong>
              {cart?.cost?.subtotalAmount
                ? `${cart.cost.subtotalAmount.amount} ${cart.cost.subtotalAmount.currencyCode}`
                : '—'}
            </strong>
          </div>
          <button
            type="button"
            className="cart-checkout"
            onClick={onCheckout}
            disabled={!cart?.checkoutUrl}
          >
            checkout
          </button>
        </div>
      </aside>
    </>
  )
}
