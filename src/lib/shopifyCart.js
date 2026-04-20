import { storefrontQuery } from './shopifyStorefront.js'

const CART_STORAGE_KEY = 'backlogstore.cartId'

const CART_QUERY = `
  query CartById($id: ID!) {
    cart(id: $id) {
      id
      checkoutUrl
      totalQuantity
      cost {
        subtotalAmount {
          amount
          currencyCode
        }
        totalAmount {
          amount
          currencyCode
        }
      }
      lines(first: 50) {
        nodes {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              availableForSale
              price {
                amount
                currencyCode
              }
              image {
                url
                altText
              }
              product {
                id
                title
                handle
                featuredImage {
                  url
                  altText
                }
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  }
`

const CART_CREATE_MUTATION = `
  mutation CreateCart($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`

const CART_LINES_ADD_MUTATION = `
  mutation AddCartLines($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`

const CART_LINES_UPDATE_MUTATION = `
  mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`

const CART_LINES_REMOVE_MUTATION = `
  mutation RemoveCartLines($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`

export function getStoredCartId() {
  return window.localStorage.getItem(CART_STORAGE_KEY) || ''
}

export function setStoredCartId(cartId) {
  if (cartId) {
    window.localStorage.setItem(CART_STORAGE_KEY, cartId)
  }
}

export function clearStoredCartId() {
  window.localStorage.removeItem(CART_STORAGE_KEY)
}

async function runCartMutation(query, variables) {
  const data = await storefrontQuery(query, variables)
  return data
}

export async function fetchCart(cartId) {
  if (!cartId) {
    return null
  }

  const data = await storefrontQuery(CART_QUERY, { id: cartId })
  return data?.cart ?? null
}

export async function createCartWithLine(line) {
  const data = await runCartMutation(CART_CREATE_MUTATION, {
    input: { lines: [line] },
  })

  const userErrors = data?.cartCreate?.userErrors ?? []
  if (userErrors.length) {
    throw new Error(userErrors[0].message)
  }

  const cart = data?.cartCreate?.cart ?? null

  if (cart?.id) {
    setStoredCartId(cart.id)
    return fetchCart(cart.id)
  }

  return cart
}

export async function addLineToCart(cartId, line) {
  const data = await runCartMutation(CART_LINES_ADD_MUTATION, {
    cartId,
    lines: [line],
  })

  const userErrors = data?.cartLinesAdd?.userErrors ?? []
  if (userErrors.length) {
    throw new Error(userErrors[0].message)
  }

  const cart = data?.cartLinesAdd?.cart ?? null

  if (cart?.id) {
    return fetchCart(cart.id)
  }

  return cart
}

export async function updateLineQuantityInCart(cartId, lineId, quantity) {
  const data = await runCartMutation(CART_LINES_UPDATE_MUTATION, {
    cartId,
    lines: [{ id: lineId, quantity }],
  })

  const userErrors = data?.cartLinesUpdate?.userErrors ?? []
  if (userErrors.length) {
    throw new Error(userErrors[0].message)
  }

  const cart = data?.cartLinesUpdate?.cart ?? null

  if (cart?.id) {
    return fetchCart(cart.id)
  }

  return cart
}

export async function removeLineFromCart(cartId, lineId) {
  const data = await runCartMutation(CART_LINES_REMOVE_MUTATION, {
    cartId,
    lineIds: [lineId],
  })

  const userErrors = data?.cartLinesRemove?.userErrors ?? []
  if (userErrors.length) {
    throw new Error(userErrors[0].message)
  }

  const cart = data?.cartLinesRemove?.cart ?? null

  if (cart?.id) {
    return fetchCart(cart.id)
  }

  return cart
}
