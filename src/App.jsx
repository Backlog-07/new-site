import './App.css'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Header } from './components/Header.jsx'
import { Footer } from './components/Footer.jsx'
import { ProductShowcase } from './components/ProductShowcase.jsx'
import { ServiceStrip } from './components/ServiceStrip.jsx'
import { SubscribeSection } from './components/SubscribeSection.jsx'
import { ProductDetail } from './components/ProductDetail.jsx'
import { PlaceholderVideoSection } from './components/PlaceholderVideoSection.jsx'
import { WorldPage } from './components/WorldPage.jsx'
import { AboutPage } from './components/AboutPage.jsx'
import { useShowcaseProducts } from './hooks/useShowcaseProducts.js'
import { useShopifyCart } from './hooks/useShopifyCart.js'
import { useLandingVideo } from './hooks/useLandingVideo.js'
import { CartDrawer } from './components/CartDrawer.jsx'
import { useWorldGallery } from './hooks/useWorldGallery.js'
import { useCinematicMotion } from './hooks/useCinematicMotion.js'

function getPageFromPathname(pathname) {
  if (pathname === '/world') {
    return 'world'
  }

  if (pathname === '/about') {
    return 'about'
  }

  if (pathname.startsWith('/product/')) {
    return 'product'
  }

  return 'home'
}

function getProductIdFromPathname(pathname) {
  if (!pathname.startsWith('/product/')) {
    return ''
  }

  return decodeURIComponent(pathname.slice('/product/'.length).trim())
}

function App() {
  const [route, setRoute] = useState(() => ({
    page: getPageFromPathname(window.location.pathname),
    productId: getProductIdFromPathname(window.location.pathname),
  }))
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isBuyingNow, setIsBuyingNow] = useState(false)
  const [introProgress, setIntroProgress] = useState(0)
  const [showIntro, setShowIntro] = useState(true)
  const [introCurtainActive, setIntroCurtainActive] = useState(false)
  const [displayRoute, setDisplayRoute] = useState(() => ({
    page: getPageFromPathname(window.location.pathname),
    productId: getProductIdFromPathname(window.location.pathname),
  }))
  const [pageTransitionPhase, setPageTransitionPhase] = useState('entering')
  const [isTouchLayout, setIsTouchLayout] = useState(() =>
    window.matchMedia('(max-width: 1024px)').matches,
  )
  const touchSceneState = useRef({
    active: false,
    startY: 0,
    startScrollY: 0,
  })
  const pageTransitionTimers = useRef({
    exit: null,
    enter: null,
  })
  const { products, loading, error } = useShowcaseProducts()
  const {
    slides: worldSlides,
    loading: worldLoading,
    error: worldError,
    contentType: worldContentType,
  } = useWorldGallery()
  const { video: landingVideo } = useLandingVideo()
  const {
    cart,
    cartCount,
    checkout,
    closeCart,
    error: cartError,
    loading: cartLoading,
    isCartOpen,
    openCart,
    addToCart,
    updateCartLineQuantity,
  } = useShopifyCart()
  const selectedProduct =
    displayRoute.page === 'product'
      ? products.find((product) => product.id === displayRoute.productId) ?? null
      : null
  const pageTransitionKey =
    displayRoute.page === 'home'
      ? 'home'
      : displayRoute.page === 'product'
        ? `product-${displayRoute.productId || 'loading'}`
        : displayRoute.page
  const isHomeStack = displayRoute.page === 'home'

  useCinematicMotion({
    enabled: !showIntro,
    scopeKey: `${pageTransitionKey}:${showIntro ? 'intro' : 'ready'}`,
  })

  useLayoutEffect(() => {
    if (route.page === 'home') {
      return
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    })
  }, [route.page, route.productId])

  useEffect(() => {
    const handlePopState = () => {
      setRoute({
        page: getPageFromPathname(window.location.pathname),
        productId: getProductIdFromPathname(window.location.pathname),
      })
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  useEffect(() => {
    const header = document.querySelector('.site-header')
    if (!header) {
      return undefined
    }

    const updateHeaderHeight = () => {
      const nextHeight = Math.ceil(header.getBoundingClientRect().height)
      document.documentElement.style.setProperty('--site-header-height', `${nextHeight}px`)
    }

    updateHeaderHeight()

    const resizeObserver = new ResizeObserver(updateHeaderHeight)
    resizeObserver.observe(header)
    window.addEventListener('resize', updateHeaderHeight)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateHeaderHeight)
    }
  }, [])

  useEffect(() => {
    if (showIntro) {
      setDisplayRoute(route)
      return undefined
    }

    const currentKey = `${displayRoute.page}:${displayRoute.productId}`
    const nextKey = `${route.page}:${route.productId}`

    if (currentKey === nextKey) {
      return undefined
    }

    window.clearTimeout(pageTransitionTimers.current.exit)
    window.clearTimeout(pageTransitionTimers.current.enter)

    setPageTransitionPhase('exiting')

    pageTransitionTimers.current.exit = window.setTimeout(() => {
      setDisplayRoute(route)
      setPageTransitionPhase('entering')

      pageTransitionTimers.current.enter = window.setTimeout(() => {
        setPageTransitionPhase('idle')
      }, 720)
    }, 180)

    return () => {
      window.clearTimeout(pageTransitionTimers.current.exit)
      window.clearTimeout(pageTransitionTimers.current.enter)
    }
  }, [route.page, route.productId, showIntro, displayRoute.page, displayRoute.productId])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1024px)')

    const updateLayout = (event) => {
      setIsTouchLayout(event.matches)
    }

    setIsTouchLayout(mediaQuery.matches)

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updateLayout)
      return () => {
        mediaQuery.removeEventListener('change', updateLayout)
      }
    }

    mediaQuery.addListener(updateLayout)
    return () => {
      mediaQuery.removeListener(updateLayout)
    }
  }, [])

  useEffect(() => {
    if (!showIntro) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [showIntro])

  useEffect(() => {
    let active = true
    let hideTimer = null
    let curtainTimer = null
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const start = window.setInterval(() => {
      setIntroProgress((current) => {
        if (current >= 100) {
          window.clearInterval(start)
          if (hideTimer == null) {
            if (reduceMotion) {
              hideTimer = window.setTimeout(() => {
                if (active) {
                  setShowIntro(false)
                }
              }, 120)
            } else {
              setIntroCurtainActive(true)
              curtainTimer = window.setTimeout(() => {
                if (active) {
                  setShowIntro(false)
                }
              }, 1120)
            }
          }
          return 100
        }

        const increment = current < 35 ? 10 : current < 75 ? 7 : 4
        return Math.min(100, current + increment)
      })
    }, 90)

    return () => {
      active = false
      window.clearInterval(start)
      window.clearTimeout(curtainTimer)
      if (hideTimer != null) {
        window.clearTimeout(hideTimer)
      }
    }
  }, [])

  async function handleAddToCart(sizeEntry) {
    if (!selectedProduct || !sizeEntry) {
      return
    }

    setIsAddingToCart(true)

    try {
      await addToCart({
        merchandiseId: sizeEntry.merchandiseId,
        quantity: 1,
        selectedSize: sizeEntry,
        product: selectedProduct,
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  async function handleBuyNow(sizeEntry) {
    if (!selectedProduct || !sizeEntry) {
      return
    }

    setIsBuyingNow(true)

    try {
      const nextCart = await addToCart({
        merchandiseId: sizeEntry.merchandiseId,
        quantity: 1,
        selectedSize: sizeEntry,
        product: selectedProduct,
      })

      if (nextCart?.checkoutUrl) {
        window.location.assign(nextCart.checkoutUrl)
      } else {
        checkout()
      }
    } finally {
      setIsBuyingNow(false)
    }
  }

  function handleWorldOpen() {
    setRoute({ page: 'world', productId: '' })
    window.history.pushState({}, '', '/world')
  }

  function handleHomeOpen() {
    setRoute({ page: 'home', productId: '' })
    window.history.pushState({}, '', '/')
  }

  function handleAboutOpen() {
    setRoute({ page: 'about', productId: '' })
    window.history.pushState({}, '', '/about')
  }

  function handleProductOpen(product) {
    setRoute({ page: 'product', productId: product.id })
    window.history.pushState({}, '', `/product/${encodeURIComponent(product.id)}`)
  }

  function handleStackTouchStart(event) {
    if (!isTouchLayout) {
      return
    }

    const touch = event.touches?.[0]
    if (!touch) {
      return
    }

    touchSceneState.current.active = true
    touchSceneState.current.startY = touch.clientY
    touchSceneState.current.startScrollY = window.scrollY
  }

  function handleStackTouchMove(event) {
    if (!isTouchLayout || !touchSceneState.current.active) {
      return
    }

    event.preventDefault()

    const touch = event.touches?.[0]
    if (!touch) {
      return
    }

    const deltaY = touchSceneState.current.startY - touch.clientY
    window.scrollTo({
      top: touchSceneState.current.startScrollY + deltaY,
      left: 0,
      behavior: 'auto',
    })

    window.requestAnimationFrame(() => {
      window.dispatchEvent(new Event('scroll'))
    })
  }

  function handleStackTouchEnd() {
    touchSceneState.current.active = false
  }

  return (
    <section className={`storefront ${showIntro ? 'storefront--intro-active' : ''}`}>
      {showIntro ? (
        <div className="intro-overlay" aria-label="Loading storefront" role="status">
          <div className="intro-shell">
            <div className="intro-stage">
              <p className="intro-kicker">backlog</p>
              <div className="intro-readout">
                <strong>{introProgress}%</strong>
              </div>
              <div className="intro-progress" aria-hidden="true">
                <div
                  className="intro-progress-fill"
                  style={{ width: `${introProgress}%` }}
                />
              </div>
            </div>
            <div className={`intro-curtain${introCurtainActive ? ' is-active' : ''}`} aria-hidden="true">
              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  key={`curtain-${index}`}
                  className="intro-curtain__bar"
                  style={{ '--i': index }}
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}
      <Header
        cartCount={cartCount}
        onCartOpen={openCart}
        onHomeOpen={handleHomeOpen}
        onWorldOpen={handleWorldOpen}
        onAboutOpen={handleAboutOpen}
      />
      <main className="storefront-main" aria-hidden={showIntro}>
        <div
          className={`page-transition page-transition--${pageTransitionPhase}`}
          key={pageTransitionKey}
          data-page-transition
        >
          {isHomeStack ? (
            <div className="stacking-scene" aria-label="Homepage sections">
              <div
                className="stack-section stack-section--hero"
                style={{ '--stack-layer': 1, '--motion-delay': '0ms' }}
                data-motion-reveal
                onTouchStart={handleStackTouchStart}
                onTouchMove={handleStackTouchMove}
                onTouchEnd={handleStackTouchEnd}
                onTouchCancel={handleStackTouchEnd}
              >
                <PlaceholderVideoSection video={landingVideo} />
              </div>
              <div
                className="stack-section stack-section--products"
                style={{ '--stack-layer': 2, '--motion-delay': '90ms' }}
                data-motion-reveal
              >
                <ProductShowcase
                  products={products}
                  loading={loading}
                  error={error}
                  onSelect={handleProductOpen}
                />
              </div>
              <div
                className="stack-section stack-section--services"
                style={{ '--stack-layer': 4, '--motion-delay': '160ms' }}
                data-motion-reveal
              >
                <ServiceStrip />
              </div>
              <div
                className="stack-section stack-section--subscribe"
                style={{ '--stack-layer': 5, '--motion-delay': '230ms' }}
                data-motion-reveal
              >
                <SubscribeSection />
              </div>
              <div
                className="stack-section stack-section--footer"
                style={{ '--stack-layer': 6, '--motion-delay': '300ms' }}
                data-motion-reveal
              >
                <Footer onAboutOpen={handleAboutOpen} />
              </div>
            </div>
          ) : displayRoute.page === 'world' ? (
            <WorldPage
              slides={worldSlides}
              loading={worldLoading}
              error={worldError}
              contentType={worldContentType}
            />
          ) : displayRoute.page === 'about' ? (
            <AboutPage />
          ) : displayRoute.page === 'product' ? (
            selectedProduct ? (
              <ProductDetail
                key={selectedProduct.id}
                product={selectedProduct}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                addingToCart={isAddingToCart}
                buyingNow={isBuyingNow}
                onBack={handleHomeOpen}
              />
            ) : (
              <div className="product-detail-page product-detail-page--loading">
                <div className="product-detail-loading">
                  <p>{loading ? 'Loading product...' : 'Product not found.'}</p>
                  <button type="button" className="product-detail-loading-back" onClick={handleHomeOpen}>
                    Back to home
                  </button>
                </div>
              </div>
            )
          ) : null}
        </div>
      </main>
      {!isHomeStack ? (
        <Footer onAboutOpen={handleAboutOpen} />
      ) : null}
      <CartDrawer
        cart={cart}
        isOpen={isCartOpen}
        onClose={closeCart}
        onCheckout={checkout}
        onUpdateQuantity={updateCartLineQuantity}
        updating={cartLoading}
      />
      {cartError ? <div className="cart-error-banner">{cartError.message}</div> : null}
    </section>
  )
}

export default App
