import { useEffect, useRef, useState } from 'react'

const faqItems = [
  {
    question: 'What is the return policy?',
    answer:
      'Returns are accepted within the stated return window for eligible items. Final sale items are not eligible for return.',
  },
  {
    question: 'Are any purchases final sale?',
    answer:
      'Yes. Items marked final sale are not eligible for return or exchange unless required by law.',
  },
  {
    question: 'When will I get my order?',
    answer:
      'Orders are usually processed within 1 to 3 business days, then delivered based on the shipping method selected at checkout.',
  },
  {
    question: 'Where are your products manufactured?',
    answer:
      'Our products are manufactured with trusted production partners and inspected for quality before they leave the facility.',
  },
  {
    question: 'How much does shipping cost?',
    answer:
      'Shipping costs are calculated at checkout based on your location and the shipping method you choose.',
  },
]

function FaqItem({ question, answer, isOpen, onToggle }) {
  const panelRef = useRef(null)
  const [maxHeight, setMaxHeight] = useState('0px')

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) {
      return
    }

    if (isOpen) {
      setMaxHeight(`${panel.scrollHeight}px`)
      return
    }

    setMaxHeight('0px')
  }, [isOpen, answer])

  return (
    <div className={`faq-item${isOpen ? ' is-open' : ''}`}>
      <button type="button" className="faq-item__summary" onClick={onToggle} aria-expanded={isOpen}>
        <span>{question}</span>
        <span className="faq-item__icon" aria-hidden="true">
          +
        </span>
      </button>
      <div
        ref={panelRef}
        className="faq-item__panel"
        style={{ maxHeight }}
        aria-hidden={!isOpen}
      >
        <div className="faq-item__panel-inner">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  )
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(-1)

  return (
    <section className="faq-section" aria-label="Frequently asked questions">
      <div className="faq-section__inner">
        <h2 className="faq-section__title">FAQ&apos;S</h2>

        <div className="faq-section__list">
          {faqItems.map((item, index) => (
            <FaqItem
              key={item.question}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
