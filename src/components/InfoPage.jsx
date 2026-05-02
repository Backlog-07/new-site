export function InfoPage({ titleLines = [], footerText = '' }) {
  return (
    <section className="about-page" aria-label="Information page" data-motion-reveal>
      <div className="about-page__frame" data-motion-parallax="0.98">
        <div className="about-page__stack" aria-label="Page content">
          {titleLines.map((line) => (
            <p key={line} className="about-page__line" data-motion-reveal data-motion-parallax="0.84">
              {line}
            </p>
          ))}
        </div>

        {footerText ? (
          <footer className="about-page__footer" aria-label="Information note">
            <p>{footerText}</p>
          </footer>
        ) : null}
      </div>
    </section>
  )
}
