export function AboutPage() {
  return (
    <section className="about-page" aria-label="About Backlog" data-motion-reveal>
      <div className="about-page__frame" data-motion-parallax="0.98">
        <div className="about-page__stack about-page__stack--desktop" aria-label="Store contact information">
          <p className="about-page__line" data-motion-reveal data-motion-parallax="0.84">CONTACT</p>
          <p className="about-page__line" data-motion-reveal data-motion-parallax="0.82">SUPPORT HOURS</p>
          <p className="about-page__line" data-motion-reveal data-motion-parallax="0.8">MONDAY TO SATURDAY</p>
          <p className="about-page__line" data-motion-reveal data-motion-parallax="0.78">12 PM - 6 PM</p>
          <p className="about-page__line" data-motion-reveal data-motion-parallax="0.76">+91 8360863502</p>
          <p className="about-page__line" data-motion-reveal data-motion-parallax="0.74">ORDERS / PRESS / SUPPORT</p>
          <p className="about-page__line" data-motion-reveal data-motion-parallax="0.72">customercare@backlogstore.in</p>
          <p className="about-page__line" data-motion-reveal data-motion-parallax="0.7">BACKLOG</p>
        </div>

        <div className="about-page__mobile" aria-label="About mobile contact information">
          <p className="about-page__mobile-kicker" data-motion-reveal data-motion-parallax="0.85">
            ABOUT US
          </p>
          <div className="about-page__mobile-copy">
            <p data-motion-reveal>
              Backlog is built for everyday wear, thoughtful details, and a cleaner way to shop the collection.
            </p>
            <p data-motion-reveal>
              For product information or order questions, email <strong>customercare@backlogstore.in</strong> or message us at{' '}
              <strong>+91 8360863502</strong>.
            </p>
            <p data-motion-reveal>
              For business, press, or partnership queries, reach out to{' '}
              <strong>customercare@backlogstore.in</strong>.
            </p>
          </div>
        </div>

        <footer className="about-page__footer" aria-label="Contact note">
          <p>orders / press / support</p>
        </footer>
      </div>
    </section>
  )
}
