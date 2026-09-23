import { useMemo, useState } from 'react'
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
export default function CateringMenu() {
  const [guests, setGuests] = useState('')
  // { [courseId]: { [groupId]: choiceId } }
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

  const headcount = Number(guests) > 0 ? Math.floor(Number(guests)) : 0
  const set = (key) => (event) => setForm((s) => ({ ...s, [key]: event.target.value }))

  const choose = (courseId, groupId, choiceId) =>
    setPicks((s) => ({ ...s, [courseId]: { ...s[courseId], [groupId]: choiceId } }))

  const clearCourse = (courseId) =>
    setPicks((s) => {
      const next = { ...s }
      delete next[courseId]
      return next
    })

  /**
   * What has been chosen, priced against the headcount.
   *
   * `perHead` is null when we cannot price it yet — no headcount, or a party
   * smaller than the course's minimum — and the page says so rather than
   * showing a number that would be wrong.
   */
  const selection = useMemo(
    () =>
      courses
        .filter((course) => Object.values(picks[course.id] ?? {}).some(Boolean))
        .map((course) => {
          const chosen = course.groups
            .map((group) => {
              const choice = group.choices.find((c) => c.id === picks[course.id]?.[group.id])
              return choice ? { group, choice } : null
            })
            .filter(Boolean)

          // A flat-rate option (the Chinese courses) prices itself; everything
          // else comes from the headcount band.
          const flat = chosen.find(({ choice }) => choice.price)?.choice.price ?? null
          const tier = tierFor(course.tiers, headcount)
          const below = headcount > 0 && headcount < minGuests(course)
          const perHead = flat ?? (below ? null : tier?.price ?? null)

          return { course, chosen, perHead, below, tier }
        }),
    [picks, headcount]
  )

  const estimate = selection.reduce(
    (sum, line) => sum + (line.perHead && headcount ? line.perHead * headcount : 0),
    0
  )
  const priceable = selection.filter((line) => line.perHead && headcount)
  const fullyPriced = selection.length > 0 && priceable.length === selection.length

  const enquiryReady = form.name && form.phone && looksLikeEmail(form.email)

  // TODO connect to Hothobs' preferred destination (email, CRM or WhatsApp
  // handoff). Whatever sends it needs `form`, `headcount` and `selection` —
  // the selection is the part that makes the enquiry worth answering.
  const submit = (event) => {
    event.preventDefault()
    setSent(true)
  }

  const reset = () => {
    setSent(false)
    setPicks({})
    setGuests('')
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
          {/* Full width and ahead of everything: what is included applies to
              every course below, so it is read once, not per course. */}
          <div className="panel cater-includes">
            <h2>What every booking includes</h2>
            <ul className="cater-included">
              {servicesIncluded.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="checkout">
            <div>
              {courses.map((course) => {
                const line = selection.find((l) => l.course.id === course.id)
                return (
                  <article className="panel" id={course.id} key={course.id}>
                    <div className="cater-head">
                      <div>
                        <h3 style={{ margin: 0 }}>{course.name}</h3>
                        <p className="note" style={{ margin: '0.35rem 0 0' }}>{course.blurb}</p>
                      </div>
                      {line && (
                        <button type="button" className="remove" onClick={() => clearCourse(course.id)}>
                          Clear
                        </button>
                      )}
                    </div>

                    {course.tiers && (
                      <ul className="cater-tiers">
                        {course.tiers.map((t) => (
                          <li key={t.id} className={line?.tier?.id === t.id ? 'on' : ''}>
                            <span>{t.label}</span>
                            <strong>{naira(t.price)}</strong>
                          </li>
                        ))}
                      </ul>
                    )}

                    {course.groups.map((group) => (
                      <fieldset className="cater-group" key={group.id}>
                        <legend>{group.name}</legend>
                        <div className="cater-options">
                          {group.choices.map((choice) => {
                            const on = picks[course.id]?.[group.id] === choice.id
                            return (
                              <label className={`cater-option ${on ? 'on' : ''}`} key={choice.id}>
                                <input
                                  type="radio"
                                  name={`${course.id}-${group.id}`}
                                  checked={on}
                                  onChange={() => choose(course.id, group.id, choice.id)}
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

                    <div className="field">
                      <label className="field-label" htmlFor="cater-guests">
                        How many guests?{' '}
                        <span className="field-hint">this sets the per-head band</span>
                      </label>
                      <input
                        id="cater-guests"
                        type="number"
                        min="1"
                        inputMode="numeric"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        placeholder="e.g. 60"
                      />
                    </div>

                    {selection.length === 0 ? (
                      <p className="note">
                        Nothing chosen yet. Pick an option from any course and it will appear here.
                      </p>
                    ) : (
                      <>
                        {selection.map(({ course, chosen, perHead, below }) => (
                          <div className="cater-line" key={course.id}>
                            <div>
                              <strong>{course.name}</strong>
                              {chosen.map(({ group, choice }) => (
                                <small key={group.id}>{choice.name}</small>
                              ))}
                            </div>
                            <div className="line-price">
                              {perHead && headcount ? (
                                <>
                                  {naira(perHead * headcount)}
                                  <div className="note" style={{ fontWeight: 400 }}>
                                    {naira(perHead)} × {headcount}
                                  </div>
                                </>
                              ) : (
                                <span className="note" style={{ fontWeight: 400 }}>
                                  {below
                                    ? `from ${minGuests(course)} guests`
                                    : headcount
                                      ? 'we will quote'
                                      : 'add a headcount'}
                                </span>
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
