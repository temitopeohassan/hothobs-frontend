import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { heroEyebrow, heroFeatures } from '../data/site.js'
import '../styles/hero.css'

const ORDER = heroFeatures.map((f) => f.id)
const BY_ID = Object.fromEntries(heroFeatures.map((f) => [f.id, f]))
const FIRST = ORDER[0]

/** How long .sky-layer takes to cross-fade, plus a frame of slack. */
const FADE = 260
/** Total run time of the entrance sequence, after which it deletes itself. */
const ENTRANCE = 2150
/** A font stall must not be able to hold the page on a blank first frame. */
const FONT_GUARD = 500
/** rAF can be paused outright; the entrance must still be able to start. */
const RAF_GUARD = 400

function reducedMotion() {
  return Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
}

export default function Hero() {
  const [featured, setFeatured] = useState(FIRST)
  const [previous, setPrevious] = useState(null)
  // A backdrop only gets its background-image once it is in here, so the two
  // features that are not on screen cost nothing on first load.
  const [warmed, setWarmed] = useState(() => new Set([FIRST]))
  // Set on the very first render rather than in an effect, so the opening
  // frame is composed instead of flashing the finished page.
  const [phase, setPhase] = useState(() => (reducedMotion() ? 'done' : 'anim'))

  const stageRef = useRef(null)
  const fadeTimer = useRef(0)

  const warm = useCallback((id) => {
    setWarmed((set) => {
      if (set.has(id)) return set
      const next = new Set(set)
      next.add(id)
      return next
    })
  }, [])

  const show = useCallback(
    (next) => {
      if (!BY_ID[next]) return
      setFeatured((current) => {
        if (current === next) return current
        warm(next)
        // Hold the outgoing photograph at full opacity underneath until the
        // incoming one has arrived, so a slow decode cannot open a bare gap.
        setPrevious(current)
        clearTimeout(fadeTimer.current)
        fadeTimer.current = setTimeout(() => setPrevious(null), FADE)
        return next
      })
    },
    [warm]
  )

  // Entrance: wait for the fonts (guarded), then two nested frames so the
  // opening state is painted before the animation starts. This runs once and
  // must NOT depend on `phase` — re-running it would tear down the timer that
  // ends the sequence, leaving the hero stuck mid-entrance.
  useEffect(() => {
    if (reducedMotion()) return undefined
    let live = true
    let started = false
    const timers = []

    let playing = false
    const begin = () => {
      if (playing || !live) return
      playing = true
      setPhase('play')
      // Afterwards the hero is left in its authored static state, with no
      // timers and no residual transforms.
      timers.push(
        setTimeout(() => {
          if (live) setPhase('done')
        }, ENTRANCE)
      )
    }

    const start = () => {
      if (started || !live) return
      started = true
      requestAnimationFrame(() => requestAnimationFrame(begin))
      // requestAnimationFrame is paused in a hidden tab and in some headless
      // renderers. The opening frame holds the copy at opacity 0, so if the
      // callback never lands the hero would stay blank — always have a way out.
      timers.push(setTimeout(begin, RAF_GUARD))
    }

    // Nobody is watching a tab that was never in front; skip straight to the
    // finished state rather than playing the entrance to an empty room.
    if (document.visibilityState === 'hidden') {
      setPhase('done')
      return undefined
    }

    timers.push(setTimeout(start, FONT_GUARD))
    if (document.fonts?.ready) document.fonts.ready.then(start).catch(start)
    else start()

    return () => {
      live = false
      timers.forEach(clearTimeout)
    }
  }, [])

  // Pull the remaining photographs down once the page is quiet, so a click on
  // a side slot has nothing left to fetch.
  useEffect(() => {
    const pull = () => ORDER.forEach(warm)
    const idle = window.requestIdleCallback
    const handle = idle ? idle(pull, { timeout: 4000 }) : setTimeout(pull, 2500)
    return () => {
      if (idle) window.cancelIdleCallback?.(handle)
      else clearTimeout(handle)
    }
  }, [warm])

  useEffect(() => () => clearTimeout(fadeTimer.current), [])

  const toNextSection = () => {
    const stage = stageRef.current
    if (!stage) return
    const top = window.scrollY + stage.getBoundingClientRect().bottom
    window.scrollTo({ top, behavior: reducedMotion() ? 'auto' : 'smooth' })
  }

  const current = BY_ID[featured]
  const rest = ORDER.filter((id) => id !== featured)
  const slots = [
    { key: 'l', id: rest[0] },
    { key: 'r', id: rest[1] },
  ]

  return (
    <section
      ref={stageRef}
      className={['hero-stage', phase !== 'done' && 'anim', phase === 'play' && 'play'].filter(Boolean).join(' ')}
      aria-label="Hothobs Cuisines"
    >
      <div className="sky">
        {heroFeatures.map((f) => (
          <div
            key={f.id}
            className={`sky-layer ${f.id === featured ? 'is-active' : ''} ${f.id === previous ? 'is-prev' : ''}`}
            role="img"
            aria-label={f.id === featured ? f.alt : undefined}
            aria-hidden={f.id === featured ? undefined : 'true'}
            style={warmed.has(f.id) ? { backgroundImage: `url(${f.backdrop})` } : undefined}
          />
        ))}
      </div>

      <div className="ui">
        <div className="copy">
          <div className="col eyebrow">
            <span className="ent-mask"><span className="ent-line">{heroEyebrow}</span></span>
          </div>
          <h1 className="col title">
            <span className="ent-mask"><span className="ent-line">{current.name}</span></span>
          </h1>
          <div className="col rule"><span /></div>
          <p className="col lede">
            {current.lede} <br />{current.ledeTail}
          </p>
          <div className="col cta">
            {slots.map(({ key, id }) => (
              <button
                key={key}
                className={`planet planet-${key}`}
                type="button"
                aria-label={`Show ${BY_ID[id].name}`}
                onClick={() => show(id)}
                onPointerEnter={() => warm(id)}
                onFocus={() => warm(id)}
              >
                {/* Every cut-out lives in both slots. Switching toggles a
                    class — it must never reassign img.src, or the browser
                    keeps painting the old one until the new file lands. */}
                {heroFeatures.map((f) => (
                  <img
                    key={f.id}
                    className={f.id === id ? 'is-shown' : ''}
                    src={f.cutout}
                    alt=""
                    width="560"
                    height="560"
                  />
                ))}
              </button>
            ))}
            <Link to={current.ctaTo}>{current.ctaLabel}</Link>
            <span className="label label-l">{BY_ID[rest[0]].name}</span>
            <span className="label label-r">{BY_ID[rest[1]].name}</span>
          </div>
        </div>
      </div>

      <button className="scroll" type="button" aria-label="Scroll to next section" onClick={toNextSection}>
        <svg viewBox="0 0 26 33" fill="none" aria-hidden="true">
          <path
            d="M13 1.5 V31.5 M1.9 20.4 L13 31.5 L24.1 20.4"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        </svg>
      </button>
    </section>
  )
}
