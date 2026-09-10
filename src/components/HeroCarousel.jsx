import { useEffect, useState } from 'react'
import { heroSlides } from '../data/site.js'

const INTERVAL = 5500

function HeroPot() {
  return (
    <svg className="pot" viewBox="0 0 420 400" role="img" aria-label="A cooking pot over a flame with steam rising">
      <g fill="none" stroke="var(--sage)" strokeWidth="3" strokeLinecap="round" opacity="0.8">
        <path d="M150 120c0-26 26-30 26-52 0-14-8-20-8-20 30 14 32 40 20 58" />
        <path d="M210 108c0-30 30-34 30-58 0-16-9-22-9-22 34 16 36 46 22 66" />
        <path d="M268 122c0-22 22-26 22-44 0-12-7-17-7-17 26 12 27 34 17 50" />
      </g>
      <rect x="52" y="150" width="316" height="26" rx="13" fill="var(--cream)" />
      <path
        d="M70 176h280v28c0 42-9 83-27 121l-9 19a34 34 0 0 1-31 19H137a34 34 0 0 1-31-19l-9-19c-18-38-27-79-27-121z"
        fill="var(--warm-gold)"
      />
      <path
        d="M70 176h280v28c0 12-1 24-2 36H72c-1-12-2-24-2-36z"
        fill="var(--gold)"
        opacity="0.55"
      />
      <g stroke="var(--gold)" strokeWidth="7" strokeLinecap="round" opacity="0.9">
        <path d="M120 372c10-14 4-24 0-32" />
        <path d="M170 380c12-18 5-30 0-40" />
        <path d="M220 382c12-18 5-30 0-40" />
        <path d="M270 380c12-18 5-30 0-40" />
        <path d="M320 372c10-14 4-24 0-32" />
      </g>
    </svg>
  )
}

/** Falls back to a labelled tile until the real photograph is in public/hero/. */
function SlideMedia({ slide, eager }) {
  const [failed, setFailed] = useState(false)

  if (slide.type === 'illustration') return <HeroPot />

  if (failed || !slide.src) {
    return (
      <div className={`hero-placeholder tone-${slide.tone ?? 'deep'}`} role="img" aria-label={slide.alt}>
        <span>{slide.placeholder ?? 'Photograph to come'}</span>
      </div>
    )
  }

  return (
    <img
      className="hero-photo"
      src={slide.src}
      alt={slide.alt}
      loading={eager ? 'eager' : 'lazy'}
      // Lowercase: React 18.3 does not recognise the camelCase spelling.
      fetchpriority={eager ? 'high' : 'auto'}
      onError={() => setFailed(true)}
    />
  )
}

export default function HeroCarousel() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)

  // Someone who has asked for less motion gets a still hero; the dots still work.
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  // Keyed on index, so choosing a slide by hand restarts the wait.
  useEffect(() => {
    if (reduced || paused || heroSlides.length < 2) return undefined
    const timer = setTimeout(
      () => setIndex((i) => (i + 1) % heroSlides.length),
      INTERVAL
    )
    return () => clearTimeout(timer)
  }, [index, paused, reduced])

  const hold = () => setPaused(true)
  const release = () => setPaused(false)

  return (
    <div
      className={`hero-carousel ${reduced ? 'no-motion' : ''}`}
      role="group"
      aria-roledescription="carousel"
      aria-label="Hothobs Cuisines highlights"
      onMouseEnter={hold}
      onMouseLeave={release}
      onFocusCapture={hold}
      onBlurCapture={release}
    >
      <div className="hero-slides">
        {heroSlides.map((slide, i) => (
          <div
            key={slide.id}
            className={`hero-slide ${i === index ? 'on' : ''}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${heroSlides.length}`}
            aria-hidden={i !== index}
          >
            <SlideMedia slide={slide} eager={i === 0} />
            {slide.caption && <p className="hero-caption">{slide.caption}</p>}
          </div>
        ))}
      </div>

      {heroSlides.length > 1 && (
        <div className="hero-dots">
          {heroSlides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              className={i === index ? 'on' : ''}
              aria-label={`Show ${slide.label}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
