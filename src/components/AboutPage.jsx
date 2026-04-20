const marqueeLines = [
  'CONTACT',
  'SUPPORT HOURS',
  'MONDAY TO SATURDAY',
  '12 PM - 6 PM',
  '+91 836-995-0066',
  'ORDERS / PRESS / SUPPORT',
  'hello@backlogstore.com',
  'BACKLOG STORE',
]

export function AboutPage() {
  return (
    <section className="about-page" aria-label="About Backlog Store">
      <div className="about-page__frame">
        <div className="about-page__stack" aria-label="Store contact information">
          {marqueeLines.map((line) => (
            <p className="about-page__line" key={line}>
              {line}
            </p>
          ))}
        </div>

        <footer className="about-page__footer" aria-label="Contact note">
          <p>orders / press / support</p>
        </footer>
      </div>
    </section>
  )
}
