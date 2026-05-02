import topwearFallback from '../assets/hero.png'
import bottomwearFallback from '../assets/BACKLOG (4).png'
import { useBackgroundImage } from '../hooks/useBackgroundImage.js'
import { useCategorySplit } from '../hooks/useCategorySplit.js'

function CategoryTile({ title, image, alt, onClick }) {
  return (
    <button
      type="button"
      className="category-split__tile"
      aria-label={`Shop ${title}`}
      onClick={onClick}
    >
      <div className="category-split__media">
        <img className="category-split__image" src={image} alt={alt} />
      </div>
      <div className="category-split__label">{title}</div>
    </button>
  )
}

export function CategorySplitSection({ onShopOpen }) {
  const { tiles, loading } = useCategorySplit()
  const { image: backgroundImage } = useBackgroundImage()
  const fallbackTiles = [
    { title: 'topwear', image: topwearFallback, alt: 'Topwear preview' },
    {
      title: 'bottomwear',
      image: backgroundImage?.image || bottomwearFallback,
      alt: backgroundImage?.alt || 'Bottomwear preview',
    },
  ]
  const displayedTiles = [
    tiles[0] ?? fallbackTiles[0],
    tiles[1] ?? fallbackTiles[1],
  ]

  return (
    <section className="category-split" aria-label="Shop categories" data-motion-reveal>
      <div className="category-split__grid">
        {displayedTiles.map((tile, index) => (
          <CategoryTile
            key={tile.id || tile.handle || tile.title || index}
            title={tile.title}
            image={tile.image}
            alt={tile.alt}
            onClick={onShopOpen}
          />
        ))}
      </div>
      {loading && tiles.length === 0 ? <span className="sr-only">Loading category images</span> : null}
    </section>
  )
}
