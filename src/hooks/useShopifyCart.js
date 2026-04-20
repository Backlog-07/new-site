import { useEffect, useState } from 'react'
import {
  addLineToCart,
  clearStoredCartId,
  createCartWithLine,
  fetchCart,
  getStoredCartId,
  removeLineFromCart,
  setStoredCartId,
  updateLineQuantityInCart,
} from '../lib/shopifyCart.js'

export function useShopifyCart() {
  const [cart, setCart] = useState(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [loading, setLoading] = useState(() => Boolean(getStoredCartId()))
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    const cartId = getStoredCartId()

    if (!cartId) {
      return () => {
        active = false
      }
    }

    fetchCart(cartId)
      .then((nextCart) => {
        if (active) {
          setCart(nextCart)
        }
      })
      .catch(() => {
        if (active) {
          clearStoredCartId()
          setCart(null)
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)

  async function addToCart({ merchandiseId, quantity = 1, selectedSize, product }) {
    if (!merchandiseId) {
      throw new Error('Please choose an available size before adding to cart.')
    }

    const line = {
      merchandiseId,
      quantity,
      attributes: [
        { key: 'product', value: product?.title ?? '' },
        { key: 'size', value: selectedSize?.label ?? '' },
      ],
    }

    setLoading(true)
    setError(null)

    try {
      const nextCart = cart?.id
        ? await addLineToCart(cart.id, line)
        : await createCartWithLine(line)

      if (!nextCart) {
        throw new Error('Unable to update cart.')
      }

      setCart(nextCart)
      setStoredCartId(nextCart.id)
      setIsCartOpen(true)
      return nextCart
    } catch (nextError) {
      setError(nextError)
      throw nextError
    } finally {
      setLoading(false)
    }
  }

  async function updateCartLineQuantity(lineId, quantity) {
    if (!cart?.id || !lineId) {
      throw new Error('Cart is not ready.')
    }

    setLoading(true)
    setError(null)

    try {
      const nextCart =
        quantity > 0
          ? await updateLineQuantityInCart(cart.id, lineId, quantity)
          : await removeLineFromCart(cart.id, lineId)

      if (!nextCart) {
        throw new Error('Unable to update cart.')
      }

      setCart(nextCart)
      setStoredCartId(nextCart.id)
      return nextCart
    } catch (nextError) {
      setError(nextError)
      throw nextError
    } finally {
      setLoading(false)
    }
  }

  function checkout() {
    if (cart?.checkoutUrl) {
      window.location.assign(cart.checkoutUrl)
    }
  }

  return {
    cart,
    cartCount: cart?.totalQuantity ?? 0,
    checkout,
    closeCart,
    error,
    isCartOpen,
    loading,
    openCart,
    addToCart,
    updateCartLineQuantity,
  }
}
