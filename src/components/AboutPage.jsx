export function AboutPage() {
  return (
    <section className="about-page" aria-label="About Backlog Store">
      <div className="about-page__frame">
        <div className="about-page__stack about-page__stack--desktop" aria-label="Store contact information">
          <p className="about-page__line">CONTACT</p>
          <p className="about-page__line">SUPPORT HOURS</p>
          <p className="about-page__line">MONDAY TO SATURDAY</p>
          <p className="about-page__line">12 PM - 6 PM</p>
          <p className="about-page__line">+91 836-995-0066</p>
          <p className="about-page__line">ORDERS / PRESS / SUPPORT</p>
          <p className="about-page__line">hello@backlogstore.com</p>
          <p className="about-page__line">BACKLOG STORE</p>
        </div>

        <div className="about-page__mobile" aria-label="About mobile contact information">
          <p className="about-page__mobile-kicker">ABOUT US</p>
          <div className="about-page__mobile-copy">
            <p>
              Backlog is built for everyday wear, thoughtful details, and a cleaner way to shop the collection.
            </p>
            <p>
              For product information or order questions, email <strong>hello@backlogstore.com</strong> or message us at{' '}
              <strong>+91 836-995-0066</strong>.
            </p>
            <p>
              For business, press, or partnership queries, reach out to{' '}
              <strong>hello@backlogstore.com</strong>.
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
