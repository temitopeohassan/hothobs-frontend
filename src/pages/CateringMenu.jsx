import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SteamRule from '../components/SteamRule.jsx'
import { naira } from '../data/menu.js'
import { contact, occasions } from '../data/site.js'
import { looksLikeEmail } from '../lib/email.js'
import {
  additionalFees,
  courses,
  minGuests,
  servicesIncluded,
  tierFor,
} from '../data/catering-menu.js'

/**
 * The 2026 catering menu, and the only way to enquire about catering.
 *
 * Deliberately not shoppable. Catering is quoted by the kitchen — headcount,
 * date, venue and transport all move the number — so the panel beside the
 * menu is both the running selection and the enquiry form: what you chose and
 * who we should call stay in one place, in view, as you scroll the courses.
 * Nothing here touches CartContext, and every total is described as an
 * estimate wherever it appears.
 */
/** The site header's height — the course bar sticks just under it. */
const HEADER_H = 72

const sections = courses.map((c) => ({ id: c.id, name: c.name }))
// Two rows, split as evenly as the count allows.
const navRows = [
  sections.slice(0, Math.ceil(sections.length / 2)),
  sections.slice(Math.ceil(sections.length / 2)),
]
const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

/**
 * Glides the page to `y` rather than jumping, so the courses visibly travel
 * past — which is what lets the parallax read. The duration grows with the
 * distance but is capped, so a jump from top to bottom never drags.
 */
function glideTo(y, onDone) {
  if (reducedMotion()) {
    window.scrollTo(0, y)
    onDone?.()
    return () => {}
  }
  const from = window.scrollY
  const delta = y - from
  const duration = Math.min(1100, 380 + Math.abs(delta) * 0.25)
  const start = performance.now()
  let frame
  const step = (now) => {
    const t = Math.min(1, (now - start) / duration)
    window.scrollTo(0, from + delta * easeInOutCubic(t))
    if (t < 1) frame = requestAnimationFrame(step)
    else onDone?.()
  }
  frame = requestAnimationFrame(step)
  return () => cancelAnimationFrame(frame)
}

/** Per-head price for `qty` of a dish: its own flat rate, else the course band. */
const perHeadFor = (course, choice, qty) => choice.price ?? tierFor(course.tiers, qty)?.price ?? null

/**
 * A quantity stepper that can also be typed into. Typing is free while the
 * field has focus — clamping on every keystroke would turn "1" on the way
 * to "120" into the minimum — and settles to the floor on blur.
 */
function QtyInput({ value, min, onChange, labelledBy }) {
  const [draft, setDraft] = useState(null)
  const commit = (raw) => {
    const n = Math.floor(Number(raw))
    onChange(Number.isFinite(n) && n >= min ? n : min)
    setDraft(null)
  }
  return (
    <div className="qty" role="group" aria-labelledby={labelledBy}>
      <button type="button" aria-label="One fewer" disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))}>
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        aria-labelledby={labelledBy}
        value={draft ?? value}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            commit(e.currentTarget.value)
          }
        }}
      />
      <button type="button" aria-label="One more" onClick={() => onChange(value + 1)}>
        +
      </button>
    </div>
  )
}

export default function CateringMenu() {
  // { [courseId]: { [groupId]: { [choiceId]: quantity } } } — a dish is
  // chosen when it has a quantity, and any number can be chosen per group.
  const [picks, setPicks] = useState({})
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    occasion: '',
    details: '',
  })
  const [sent, setSent] = useState(false)
  const [activeCourse, setActiveCourse] = useState(sections[0].id)
  const navRef = useRef(null)
  const panelRefs = useRef({})
  // While a click-glide runs, the highlight is already where it is going;
  // letting the scroll handler move it would flicker it through every
  // course on the way.
  const gliding = useRef(false)
  const cancelGlide = useRef(() => {})

  // One rAF-throttled scroll handler does two jobs: works out which course
  // is under the bar, and nudges each course panel by a fraction of its
  // distance from the middle of the screen — the parallax. Panels near the
  // centre sit still; those entering and leaving drift, so the menu moves
  // at a different pace from the page around it.
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const navH = navRef.current?.offsetHeight ?? 0
      const line = HEADER_H + navH + 24
      const mid = window.innerHeight / 2
      const still = reducedMotion()
      // The summary panel sticks below the bar, so it needs the bar's real
      // height — two rows of chips is taller on some screens than others.
      document.documentElement.style.setProperty('--cater-nav-h', `${navH}px`)
      let current = sections[0].id
      for (const course of sections) {
        const el = panelRefs.current[course.id]
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top - line <= 0) current = course.id
        if (still) {
          el.style.removeProperty('--shift')
        } else {
          const offset = (rect.top + rect.height / 2 - mid) / window.innerHeight
          el.style.setProperty('--shift', `${Math.max(-1, Math.min(1, offset)) * 28}px`)
        }
      }
      if (!gliding.current) setActiveCourse(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      cancelGlide.current()
      document.documentElement.style.removeProperty('--cater-nav-h')
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Keep the highlighted chip in view inside the bar on narrow screens,
  // scrolling the bar only — scrollIntoView would also move the page.
  useEffect(() => {
    const bar = navRef.current
    const chip = bar?.querySelector(`[data-course="${activeCourse}"]`)
    if (!bar || !chip) return
    const left = chip.offsetLeft
    if (left < bar.scrollLeft || left + chip.offsetWidth > bar.scrollLeft + bar.clientWidth) {
      bar.scrollTo({ left: left - 16, behavior: reducedMotion() ? 'auto' : 'smooth' })
    }
  }, [activeCourse])

  const goToCourse = (id) => {
    const el = panelRefs.current[id]
    if (!el) return
    const navH = navRef.current?.offsetHeight ?? 0
    // Measured from the panel's resting position, not its shifted one, so
    // the parallax nudge does not throw the landing spot off.
    const shift = parseFloat(el.style.getPropertyValue('--shift')) || 0
    const y = el.getBoundingClientRect().top - shift + window.scrollY - HEADER_H - navH - 16
    cancelGlide.current()
    gliding.current = true
    setActiveCourse(id)
    cancelGlide.current = glideTo(y, () => {
      gliding.current = false
    })
    window.history.replaceState(window.history.state, '', `#${id}`)
  }

  const set = (key) => (event) => setForm((s) => ({ ...s, [key]: event.target.value }))

  const qtyOf = (courseId, groupId, choiceId) => picks[courseId]?.[groupId]?.[choiceId]

  /** Sets a dish's quantity; `null` unticks it. */
  const setQty = (courseId, groupId, choiceId, qty) =>
    setPicks((s) => {
      const group = { ...s[courseId]?.[groupId] }
      if (qty == null) delete group[choiceId]
      else group[choiceId] = qty
      return { ...s, [courseId]: { ...s[courseId], [groupId]: group } }
    })

  // Ticking a dish starts it at the course minimum, so it is priceable from
  // the moment it is chosen; the quantity control will not go below it.
  const toggle = (course, groupId, choiceId) =>
    setQty(course.id, groupId, choiceId, qtyOf(course.id, groupId, choiceId) ? null : minGuests(course))

  const clearCourse = (courseId) =>
    setPicks((s) => {
      const next = { ...s }
      delete next[courseId]
      return next
    })

  /**
   * Every chosen dish, one line each, priced by its own quantity.
   *
   * A flat-rate option (the Chinese courses) prices itself; everything else
   * takes the per-head band its quantity falls in. `perHead` is null only
   * if a course has neither, and the page then says the kitchen will quote.
   */
  const selection = useMemo(
    () =>
      courses.flatMap((course) =>
        course.groups.flatMap((group) =>
          group.choices
            .filter((choice) => picks[course.id]?.[group.id]?.[choice.id])
            .map((choice) => {
              const qty = picks[course.id][group.id][choice.id]
              const tier = tierFor(course.tiers, qty)
              const perHead = choice.price ?? tier?.price ?? null
              return { key: `${course.id}/${group.id}/${choice.id}`, course, group, choice, qty, tier, perHead }
            })
        )
      ),
    [picks]
  )

  const estimate = selection.reduce((sum, line) => sum + (line.perHead ?? 0) * line.qty, 0)
  const fullyPriced = selection.length > 0 && selection.every((line) => line.perHead)

  const enquiryReady = form.name && form.phone && looksLikeEmail(form.email)

  // TODO connect to Hothobs' preferred destination (email, CRM or WhatsApp
  // handoff). Whatever sends it needs `form` and `selection` (each dish with its quantity) —
  // the selection is the part that makes the enquiry worth answering.
  const submit = (event) => {
    event.preventDefault()
    setSent(true)
  }

  const reset = () => {
    setSent(false)
    setPicks({})
    setForm({ name: '', phone: '', email: '', date: '', occasion: '', details: '' })
  }

  return (
    <>
      <section className="band band-deep" style={{ paddingBottom: '2rem' }}>
        <div className="wrap">
          <h1 style={{ color: 'var(--cream)' }}>Catering menu</h1>
          <p style={{ fontSize: '1.1rem', maxWidth: '52ch' }}>
            Canapés, mini bowls, soups and the full Nigerian, Chinese and continental spreads.
            Choose what you want on the table, tell us how many people, and send it over as an
            enquiry — we will come back with a firm quote.
          </p>
          <p
            className="note"
            style={{ color: 'rgba(255, 248, 232, 0.75)', maxWidth: '52ch', fontStyle: 'italic' }}
          >
            * Prices here are per head and indicative, before service charge and transport.
          </p>
        </div>
        <SteamRule color="var(--cream)" />
      </section>

      <section className="band band-cream" style={{ paddingTop: '2rem' }}>
        <div className="wrap">
          {/* The course bar: sticky under the site header for the length of
              the menu, so any course is one click away from anywhere. It
              highlights the course being read as the page scrolls. */}
          <nav className="cater-nav" ref={navRef} aria-label="Catering menu courses">
            {navRows.map((row, i) => (
              <div className="cater-nav-row" key={i}>
                {row.map((course) => (
                  <a
                    key={course.id}
                    href={`#${course.id}`}
                    data-course={course.id}
                    className={activeCourse === course.id ? 'on' : ''}
                    aria-current={activeCourse === course.id ? 'true' : undefined}
                    onClick={(event) => {
                      event.preventDefault()
                      goToCourse(course.id)
                    }}
                  >
                    {course.name}
                  </a>
                ))}
              </div>
            ))}
          </nav>

          <div className="checkout">
            <div>
              {courses.map((course) => {
                const lines = selection.filter((l) => l.course.id === course.id)
                return (
                  <article
                    className="panel cater-course"
                    id={course.id}
                    key={course.id}
                    ref={(el) => {
                      panelRefs.current[course.id] = el
                    }}
                  >
                    <div className="cater-head">
                      <div>
                        <h3 style={{ margin: 0 }}>{course.name}</h3>
                        <p className="note" style={{ margin: '0.35rem 0 0' }}>{course.blurb}</p>
                      </div>
                      {lines.length > 0 && (
                        <button type="button" className="remove" onClick={() => clearCourse(course.id)}>
                          Clear
                        </button>
                      )}
                    </div>

                    {course.groups.map((group) => (
                      <fieldset className="cater-group" key={group.id}>
                        <legend>{group.name}</legend>
                        <div className="cater-options">
                          {group.choices.map((choice) => {
                            const qty = qtyOf(course.id, group.id, choice.id)
                            const on = Boolean(qty)
                            const min = minGuests(course)
                            const inputId = `${course.id}-${group.id}-${choice.id}`
                            return (
                              <div className={`cater-option ${on ? 'on' : ''}`} key={choice.id}>
                              <label className="cater-option-pick" htmlFor={inputId}>
                                <input
                                  id={inputId}
                                  type="checkbox"
                                  checked={on}
                                  onChange={() => toggle(course, group.id, choice.id)}
                                />
                                <span className="cater-option-name">
                                  {choice.name}
                                  {choice.price && (
                                    <em className="cater-option-price">
                                      {naira(choice.price)} per head
                                    </em>
                                  )}
                                </span>
                                {/* Spans, not a list: this sits inside a
                                    <label>, which may only hold phrasing
                                    content — and the whole card has to stay
                                    clickable. */}
                                {choice.items && (
                                  <span className="cater-items">
                                    {choice.items.map((item) => (
                                      <span key={item}>{item}</span>
                                    ))}
                                  </span>
                                )}
                              </label>

                              {/* Outside the <label>: a button in there would
                                  also toggle the checkbox. */}
                              {on && (
                                <div className="cater-qty">
                                  <span className="cater-qty-label" id={`${inputId}-qty`}>
                                    Quantity <span className="field-hint">guests{min > 1 ? `, min ${min}` : ''}</span>
                                  </span>
                                  <QtyInput
                                    value={qty}
                                    min={min}
                                    labelledBy={`${inputId}-qty`}
                                    onChange={(n) => setQty(course.id, group.id, choice.id, n)}
                                  />
                                  {/* The rate follows the quantity: larger
                                      parties drop into a cheaper band. */}
                                  {perHeadFor(course, choice, qty) && (
                                    <span className="cater-qty-total">
                                      {naira(perHeadFor(course, choice, qty) * qty)}
                                      <small>{naira(perHeadFor(course, choice, qty))} per head</small>
                                    </span>
                                  )}
                                </div>
                              )}
                              </div>
                            )
                          })}
                        </div>
                      </fieldset>
                    ))}

                    {course.extras && (
                      <p className="note" style={{ marginBottom: 0 }}>
                        <strong>{course.extrasNote}</strong> {course.extras.join(' · ')}
                      </p>
                    )}
                  </article>
                )
              })}

            </div>

            {/* Selection and enquiry are one panel — the only form on the
                page. It stays stuck beside the menu so what has been chosen
                and who we should call never leave the screen. */}
            <div className="cater-aside">
              <form className="panel cater-summary" onSubmit={submit} noValidate>
                {sent ? (
                  <div className="confirm">
                    <div className="confirm-mark" aria-hidden="true">✓</div>
                    <h3 style={{ marginTop: 0 }}>Enquiry sent</h3>
                    <p>
                      Thank you, {form.name || 'friend'}. We have your selection and will come back
                      to you within one working day with a firm quote. If it is urgent, call{' '}
                      {contact.phone}.
                    </p>
                    <button type="button" className="btn btn-outline-dark" onClick={reset}>
                      Start another enquiry
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 style={{ marginTop: 0 }}>Your selection</h3>

                    {selection.length === 0 ? (
                      <p className="note">
                        Nothing chosen yet. Tick any dishes you want, set how many guests each
                        one is for, and they will appear here.
                      </p>
                    ) : (
                      <>
                        {selection.map(({ key, course, choice, qty, perHead }) => (
                          <div className="cater-line" key={key}>
                            <div>
                              <strong>{choice.name}</strong>
                              <small>{course.name} · {qty} {qty === 1 ? 'guest' : 'guests'}</small>
                            </div>
                            <div className="line-price">
                              {perHead ? (
                                <>
                                  {naira(perHead * qty)}
                                  <div className="note" style={{ fontWeight: 400 }}>
                                    {naira(perHead)} × {qty}
                                  </div>
                                </>
                              ) : (
                                <span className="note" style={{ fontWeight: 400 }}>we will quote</span>
                              )}
                            </div>
                          </div>
                        ))}

                        {fullyPriced && (
                          <div className="summary-total">
                            <span>Estimated food cost</span>
                            <span className="price">{naira(estimate)}</span>
                          </div>
                        )}
                        <p className="note" style={{ marginTop: '0.75rem' }}>
                          An estimate for the food only, before service charge (15% – 20%) and
                          transport. Your quote is confirmed by the kitchen.
                        </p>
                      </>
                    )}

                    <h4 className="cater-subhead">Your details</h4>

                    <div className="field">
                      <label htmlFor="c-name" className="field-label">Your name</label>
                      <input id="c-name" type="text" autoComplete="name" value={form.name}
                        onChange={set('name')} />
                    </div>
                    <div className="field">
                      <label htmlFor="c-phone" className="field-label">Phone</label>
                      <input id="c-phone" type="tel" autoComplete="tel" value={form.phone}
                        onChange={set('phone')} />
                    </div>
                    <div className="field">
                      <label htmlFor="c-email" className="field-label">Email</label>
                      <input id="c-email" type="email" autoComplete="email" value={form.email}
                        onChange={set('email')} />
                    </div>
                    <div className="field">
                      <label htmlFor="c-date" className="field-label">Date of the event</label>
                      <input id="c-date" type="text" placeholder="e.g. 14 December" value={form.date}
                        onChange={set('date')} />
                    </div>
                    <div className="field">
                      <label htmlFor="c-occasion" className="field-label">Occasion</label>
                      <select id="c-occasion" value={form.occasion} onChange={set('occasion')}>
                        <option value="">Choose one</option>
                        {occasions.map((o) => <option key={o}>{o}</option>)}
                        <option>Something else</option>
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="c-details" className="field-label">
                        Anything else we should know?
                      </label>
                      <textarea id="c-details" rows="3" value={form.details} onChange={set('details')}
                        placeholder="Venue, serving time, dietary needs." />
                    </div>

                    <button className="btn btn-gold btn-block" type="submit" disabled={!enquiryReady}>
                      Send enquiry
                    </button>
                    {!enquiryReady && (
                      <p className="note" style={{ marginTop: '0.75rem' }}>
                        Add your name, phone number and email address so we can reach you.
                      </p>
                    )}

                    <div className="cater-includes">
                      <h4 className="cater-subhead">What every booking includes</h4>
                      <ul className="cater-included">
                        {servicesIncluded.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <p className="note" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
                      We take catering by enquiry, not online payment — so nothing here goes to your
                      cart. We reply within one working day; for anything in the next 48 hours, call{' '}
                      {contact.phone}.
                    </p>
                  </>
                )}
              </form>
            </div>
          </div>

          {/* Terms sit under the menu rather than beside it: they are what
              you read once you know what you want, and keeping the column
              clear is what lets the selection stay stuck to the menu. */}
          <div className="cater-terms">
            <div className="head">
              <h2>Before you book</h2>
            </div>
            <div className="info">
              {additionalFees.map((f) => (
                <div key={f.title}>
                  <strong>{f.title}</strong>
                  <p>{f.body}</p>
                </div>
              ))}
            </div>
            <p className="note" style={{ marginTop: '1.5rem', marginBottom: 0 }}>
              Looking for everyday food instead? <Link to="/menu">Browse the menu</Link> — that is
              the part you can order and pay for online.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
