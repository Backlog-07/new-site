const reviews = [
  {
    id: 'review-1',
    image: '',
    name: 'Mr. Trussell',
    verified: true,
    title: 'good belt',
    body: 'good belt',
    product: 'Internet Explorer Belt',
    stars: 5,
  },
  {
    id: 'review-2',
    image: '',
    name: 'Anonymous',
    verified: true,
    title: 'Cop the wallet',
    body: 'Little bigger than expected but beautiful design and great storage!',
    product: '0499 - Embossed Dragon Wallet V2',
    stars: 5,
  },
  {
    id: 'review-3',
    image: '',
    name: 'Anonymous',
    verified: false,
    title: "It's perfect quality",
    body: "It's perfect quality. Only downfall is the delivery time but so worth it",
    product: 'Dragon Sword Stone Necklace',
    stars: 5,
  },
]

function Stars({ count = 5 }) {
  return (
    <div className="customer-review-stars" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, index) => (
        <span key={index} aria-hidden="true">
          ★
        </span>
      ))}
    </div>
  )
}

function ReviewCard({ review }) {
  return (
    <article className="customer-review-card">
      <div className="customer-review-image">
        {review.image ? (
          <img src={review.image} alt={review.title} />
        ) : (
          <div className="customer-review-image-placeholder">
            <span>customer image</span>
          </div>
        )}
      </div>

      <div className="customer-review-body">
        <Stars count={review.stars} />

        <div className="customer-review-author">
          <span>{review.name}</span>
          {review.verified ? <strong>Verified</strong> : null}
        </div>

        <h2>{review.title}</h2>
        <p>{review.body}</p>
        <div className="customer-review-product">{review.product}</div>
      </div>
    </article>
  )
}

export function CustomerReviewsSection() {
  return (
    <section className="customer-reviews-section" aria-label="Customer reviews">
      <div className="customer-reviews-grid">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  )
}
