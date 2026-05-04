import './App.css'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Header } from './components/Header.jsx'
import { Footer } from './components/Footer.jsx'
import { ProductShowcase } from './components/ProductShowcase.jsx'
import { ServiceStrip } from './components/ServiceStrip.jsx'
import { AfterSplitStrip } from './components/AfterSplitStrip.jsx'
import { FaqSection } from './components/FaqSection.jsx'
import { UgcVideoCarousel } from './components/UgcVideoCarousel.jsx'
import { CategorySplitSection } from './components/CategorySplitSection.jsx'
import { ProductDetail } from './components/ProductDetail.jsx'
import { ProductsPage } from './components/ProductsPage.jsx'
import { PlaceholderVideoSection } from './components/PlaceholderVideoSection.jsx'
import { WorldPage } from './components/WorldPage.jsx'
import { AboutPage } from './components/AboutPage.jsx'
import { InfoPage } from './components/InfoPage.jsx'
import { useShowcaseProducts } from './hooks/useShowcaseProducts.js'
import { useShopifyCart } from './hooks/useShopifyCart.js'
import { useShopifyProduct } from './hooks/useShopifyProduct.js'
import { useLandingVideo } from './hooks/useLandingVideo.js'
import { CartDrawer } from './components/CartDrawer.jsx'
import { useWorldGallery } from './hooks/useWorldGallery.js'
import { useUgcVideos } from './hooks/useUgcVideos.js'
import { useCinematicMotion } from './hooks/useCinematicMotion.js'
import { useHomeScrollMotion } from './hooks/useHomeScrollMotion.js'
import { scrollToTopImmediate, useLenisSmoothScroll } from './hooks/useLenisSmoothScroll.js'
import { getCachedProductByHandle, prefetchProductByHandle } from './data/showcaseProducts.js'

function getPageFromPathname(pathname) {
  if (pathname === '/products') {
    return 'products'
  }

  if (pathname === '/world') {
    return 'world'
  }

  if (pathname === '/about') {
    return 'about'
  }

  if (pathname === '/contact') {
    return pathname.slice(1)
  }

  if (pathname.startsWith('/products/') || pathname.startsWith('/product/')) {
    return 'product'
  }

  return 'home'
}

function getProductHandleFromPathname(pathname) {
  if (pathname.startsWith('/products/')) {
    return decodeURIComponent(pathname.slice('/products/'.length).trim())
  }

  if (!pathname.startsWith('/product/')) {
    return ''
  }

  return decodeURIComponent(pathname.slice('/product/'.length).trim())
}

function App() {
  const currentPathname = window.location.pathname
  const skipIntro =
    currentPathname === '/products' ||
    currentPathname.startsWith('/products/') ||
    currentPathname.startsWith('/product/')
  const [route, setRoute] = useState(() => ({
    page: getPageFromPathname(currentPathname),
    productHandle: getProductHandleFromPathname(currentPathname),
  }))
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isBuyingNow, setIsBuyingNow] = useState(false)
  const [introProgress, setIntroProgress] = useState(0)
  const [showIntro, setShowIntro] = useState(() => !skipIntro)
  const [introCurtainActive, setIntroCurtainActive] = useState(false)
  const [displayRoute, setDisplayRoute] = useState(() => ({
    page: getPageFromPathname(currentPathname),
    productHandle: getProductHandleFromPathname(currentPathname),
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
  const landingProducts = products.slice(0, 4)
  const {
    slides: worldSlides,
    loading: worldLoading,
    error: worldError,
    contentType: worldContentType,
  } = useWorldGallery()
  const {
    videos: ugcVideos,
    loading: ugcVideosLoading,
    error: ugcVideosError,
  } = useUgcVideos()
  const {
    product: selectedProduct,
    loading: productLoading,
    error: productError,
    notFound: productNotFound,
  } = useShopifyProduct(displayRoute.page === 'product' ? displayRoute.productHandle : '')
  const cachedProductPreview =
    displayRoute.page === 'product'
      ? getCachedProductByHandle(displayRoute.productHandle)
      : null
  const activeProduct = selectedProduct || cachedProductPreview
  const relatedProducts = activeProduct
    ? products.filter((product) => product.handle !== activeProduct.handle).slice(0, 4)
    : []
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
  const pageTransitionKey =
    displayRoute.page === 'home'
      ? 'home'
      : displayRoute.page === 'products'
        ? 'products'
      : displayRoute.page === 'product'
        ? `product-${displayRoute.productHandle || 'loading'}`
        : displayRoute.page
  const isHomeStack = displayRoute.page === 'home'

  useLenisSmoothScroll({
    enabled: !showIntro,
  })

  useCinematicMotion({
    enabled: !showIntro && displayRoute.page !== 'product' && displayRoute.page !== 'home',
    scopeKey: `${pageTransitionKey}:${showIntro ? 'intro' : 'ready'}`,
  })

  useHomeScrollMotion({
    enabled: !showIntro && isHomeStack,
  })

  useLayoutEffect(() => {
    if (route.page === 'home') {
      return
    }

    scrollToTopImmediate()
  }, [route.page, route.productHandle])

  useEffect(() => {
    const handlePopState = () => {
      const nextRoute = {
        page: getPageFromPathname(window.location.pathname),
        productHandle: getProductHandleFromPathname(window.location.pathname),
      }

      setRoute(nextRoute)
      setDisplayRoute(nextRoute)
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

    const currentKey = `${displayRoute.page}:${displayRoute.productHandle}`
    const nextKey = `${route.page}:${route.productHandle}`

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
  }, [route.page, route.productHandle, showIntro, displayRoute.page, displayRoute.productHandle])

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
    if (skipIntro) {
      return undefined
    }

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
  }, [skipIntro])

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
    const nextRoute = { page: 'world', productHandle: '' }
    setRoute(nextRoute)
    setDisplayRoute(nextRoute)
    window.history.pushState({}, '', '/world')
  }

  function handleHomeOpen() {
    const nextRoute = { page: 'home', productHandle: '' }
    setRoute(nextRoute)
    setDisplayRoute(nextRoute)
    window.history.pushState({}, '', '/')
  }

  function handleProductsOpen() {
    const nextRoute = { page: 'products', productHandle: '' }
    setRoute(nextRoute)
    setDisplayRoute(nextRoute)
    window.history.pushState({}, '', '/products')
  }

  function handleAboutOpen() {
    const nextRoute = { page: 'about', productHandle: '' }
    setRoute(nextRoute)
    setDisplayRoute(nextRoute)
    window.history.pushState({}, '', '/about')
  }

  function handleInfoOpen(path) {
    const normalizedPath = String(path || '').trim()
    if (!normalizedPath) {
      return
    }

    const nextRoute = { page: normalizedPath.replace(/^\//, ''), productHandle: '' }
    setRoute(nextRoute)
    setDisplayRoute(nextRoute)
    window.history.pushState({}, '', normalizedPath)
  }

  function handleExternalOpen(url) {
    if (!url) {
      return
    }

    window.open(url, '_blank', 'noopener,noreferrer')
  }

  function handleProductOpen(product) {
    const nextHandle = product.handle || product.id
    const nextRoute = { page: 'product', productHandle: nextHandle }
    setRoute(nextRoute)
    setDisplayRoute(nextRoute)
    window.history.pushState({}, '', `/products/${encodeURIComponent(nextHandle)}`)
  }

  function handleProductPrefetch(product) {
    const nextHandle = product.handle || product.id
    prefetchProductByHandle(nextHandle).catch(() => {})
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

  useEffect(() => {
    if (displayRoute.page === 'products') {
      document.title = 'Products | Backlog'

      const description = 'Browse Backlog products in one dedicated collection page.'

      let metaDescription = document.querySelector('meta[name="description"]')
      if (!metaDescription) {
        metaDescription = document.createElement('meta')
        metaDescription.setAttribute('name', 'description')
        document.head.appendChild(metaDescription)
      }
      metaDescription.setAttribute('content', description)

      return undefined
    }

    if (displayRoute.page !== 'product') {
      document.title = 'Backlog'
      return undefined
    }

    if (selectedProduct?.seo?.title) {
      document.title = `${selectedProduct.seo.title} | Backlog`
    } else if (selectedProduct?.title) {
      document.title = `${selectedProduct.title} | Backlog`
    } else if (productLoading) {
      document.title = 'Loading product | Backlog'
    } else {
      document.title = 'Product | Backlog'
    }

    const description =
      selectedProduct?.seo?.description ||
      selectedProduct?.description ||
      'Shop backlog products directly from the storefront.'

    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }
    metaDescription.setAttribute('content', description)

    return undefined
  }, [displayRoute.page, displayRoute.productHandle, productLoading, selectedProduct])

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
        onShopOpen={handleProductsOpen}
        onWorldOpen={handleWorldOpen}
        onAboutOpen={handleAboutOpen}
      />
      <main className={`storefront-main${isHomeStack ? ' storefront-main--simple' : ''}`} aria-hidden={showIntro}>
        <div
          className={`page-transition page-transition--${pageTransitionPhase}`}
          key={pageTransitionKey}
          data-page-transition
        >
          {isHomeStack ? (
            <div className="home-scroll-page" aria-label="Homepage sections">
              <div
                className="stack-section stack-section--hero"
                style={{ '--stack-layer': 1, '--motion-delay': '0ms' }}
                data-motion-reveal
                data-motion-weight
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
                data-motion-weight
              >
                <ProductShowcase
                  products={landingProducts}
                  loading={loading}
                  error={error}
                  onSelect={handleProductOpen}
                  onPrefetch={handleProductPrefetch}
                  onBrowseAll={handleProductsOpen}
                />
              </div>
              <div
                className="stack-section stack-section--services"
                style={{ '--stack-layer': 3, '--motion-delay': '160ms' }}
                data-motion-reveal
                data-motion-weight
              >
                <ServiceStrip />
              </div>
              <div
                className="stack-section stack-section--category-split"
                style={{ '--stack-layer': 4, '--motion-delay': '230ms' }}
                data-motion-reveal
                data-motion-weight
              >
                <CategorySplitSection onShopOpen={handleProductsOpen} />
              </div>
              <div
                className="stack-section stack-section--after-split"
                style={{ '--stack-layer': 5, '--motion-delay': '300ms' }}
                data-motion-reveal
                data-motion-weight
              >
                <AfterSplitStrip />
              </div>
              <div
                className="stack-section stack-section--ugc-video"
                style={{ '--stack-layer': 6, '--motion-delay': '370ms' }}
                data-motion-reveal
                data-motion-weight
              >
                <UgcVideoCarousel
                  videos={ugcVideos}
                  loading={ugcVideosLoading}
                  error={ugcVideosError}
                />
              </div>
              <div
                className="stack-section stack-section--faq"
                style={{ '--stack-layer': 7, '--motion-delay': '440ms' }}
                data-motion-reveal
                data-motion-weight
              >
                <FaqSection />
              </div>
              <div
                className="stack-section stack-section--footer"
                style={{ '--stack-layer': 8, '--motion-delay': '510ms' }}
                data-motion-reveal
                data-motion-weight
              >
                <Footer onNavigate={handleInfoOpen} onExternalNavigate={handleExternalOpen} />
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
          ) : displayRoute.page === 'contact' ? (
            <InfoPage
              titleLines={['CONTACT US', 'SUPPORT HOURS', 'MONDAY TO SATURDAY', '12 PM - 6 PM']}
              footerText="Orders, press, and support: customercare@backlogstore.in"
            />
          ) : displayRoute.page === 'privacy-policy' ? (
            <InfoPage
              titleLines={['PRIVACY POLICY', 'DATA WE COLLECT', 'HOW WE USE IT', 'STORE OPERATIONS']}
              footerText="We’re connecting the policy page now and can add full copy next."
            />
          ) : displayRoute.page === 'terms-of-service' ? (
            <InfoPage
              titleLines={['TERMS OF SERVICE', 'PLEASE REVIEW', 'PURCHASE TERMS', 'STORE USE GUIDELINES']}
              footerText="This page is wired up and ready for the full terms."
            />
          ) : displayRoute.page === 'shipping-policy' ? (
            <InfoPage
              titleLines={['SHIPPING POLICY', 'DELIVERY WINDOWS', 'ORDER PROCESSING', 'TRANSIT INFO']}
              footerText="We’ll add the shipping details here."
            />
          ) : displayRoute.page === 'refund-policy' ? (
            <InfoPage
              titleLines={['REFUND POLICY', 'RETURNS AND EXCHANGES', 'ELIGIBILITY DETAILS', 'TIMELINES']}
              footerText="This section is connected for the refund copy."
            />
          ) : displayRoute.page === 'products' ? (
            <ProductsPage
              products={products}
              loading={loading}
              error={error}
              onSelect={handleProductOpen}
              onPrefetch={handleProductPrefetch}
            />
          ) : displayRoute.page === 'product' ? (
            activeProduct ? (
              <ProductDetail
                key={activeProduct.handle || activeProduct.id}
                product={activeProduct}
                relatedProducts={relatedProducts}
                onSelectRelated={handleProductOpen}
                onPrefetchRelated={handleProductPrefetch}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                addingToCart={isAddingToCart}
                buyingNow={isBuyingNow}
                onBack={handleHomeOpen}
              />
            ) : productError ? (
              <div className="product-detail-page product-detail-page--loading">
                <div className="product-detail-loading" role="alert">
                  <p>We could not load this product.</p>
                  <p className="product-detail-loading__message">
                    {productError.message || 'Please check the Shopify storefront settings and try again.'}
                  </p>
                  <button
                    type="button"
                    className="product-detail-loading-back"
                    onClick={handleHomeOpen}
                  >
                    Back to home
                  </button>
                </div>
              </div>
            ) : productNotFound ? (
              <div className="product-detail-page product-detail-page--loading">
                <div className="product-detail-loading" role="alert">
                  <p>Product not found.</p>
                  <p className="product-detail-loading__message">
                    The handle "{displayRoute.productHandle}" does not exist in Shopify.
                  </p>
                  <button
                    type="button"
                    className="product-detail-loading-back"
                    onClick={handleHomeOpen}
                  >
                    Back to home
                  </button>
                </div>
              </div>
            ) : (
              <div className="product-detail-page product-detail-page--loading">
                <div className="product-detail-loading" role="status" aria-live="polite">
                  <p>Loading product...</p>
                  <p className="product-detail-loading__message">
                    {displayRoute.productHandle ? `Fetching ${displayRoute.productHandle} from Shopify...` : 'Preparing product page...'}
                  </p>
                  <div className="product-detail-loading__skeleton" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            )
          ) : null}
        </div>
      </main>
      {!isHomeStack ? (
        <Footer
          forceVisible={displayRoute.page === 'product'}
          onNavigate={handleInfoOpen}
          onExternalNavigate={handleExternalOpen}
        />
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
