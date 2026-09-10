/**
 * ─────────────────────────────────────────────────────────────
 *  PLACEHOLDER CONTENT — VERIFY BEFORE LAUNCH
 * ─────────────────────────────────────────────────────────────
 *  Everything marked TODO must be replaced with details confirmed
 *  by Hothobs. Do not publish phone numbers, delivery areas,
 *  cut-off times, payment methods or testimonials that have not
 *  been verified. See README.md for the full checklist.
 */

export const brand = {
  name: 'Hothobs Cuisines',
  concept: 'From the Pot to the Table.',
  message: 'Good food. Good moments.',
  positioning:
    'A contemporary Nigerian food brand offering thoughtfully prepared meals and culinary experiences for everyday dining, sharing and special occasions.',
  instagram: 'https://www.instagram.com/hothobscuisines/?hl=en',
}

export const contact = {
  phone: '+234 000 000 0000', // TODO verify
  whatsapp: '2340000000000', // TODO verify — digits only, country code first
  email: 'hello@hothobscuisines.com', // TODO verify
  address: 'Lagos, Nigeria', // TODO verify full address
  mapQuery: 'Lagos, Nigeria', // TODO verify
}

// TODO verify every line with Hothobs before publishing.
export const openingHours = [
  { days: 'Monday – Friday', hours: '9:00am – 8:00pm' },
  { days: 'Saturday', hours: '10:00am – 8:00pm' },
  { days: 'Sunday', hours: 'Closed' },
]

// TODO verify every line with Hothobs before publishing.
export const orderingInfo = [
  {
    title: 'Ordering cut-off',
    body: 'Same-day orders close at 4:00pm. Anything after that is prepared the next day.',
  },
  {
    title: 'Delivery days',
    body: 'We deliver Monday to Saturday. Sunday orders are scheduled for Monday.',
  },
  {
    title: 'Delivery areas',
    body: 'Mainland and Island Lagos. Fees are confirmed at checkout by location.',
  },
  {
    title: 'Pickup',
    body: 'Pickup is available from our kitchen during opening hours. Choose pickup at checkout.',
  },
  {
    title: 'Payment',
    body: 'Bank transfer on confirmation. Card payment is coming soon.',
  },
]

// TODO replace with genuine, attributable customer reviews only.
export const testimonials = [
  {
    quote:
      'Ordered for a family Sunday and the jollof went first. Everything arrived hot and properly packed.',
    name: 'Placeholder review',
    detail: 'Awaiting verified customer',
  },
  {
    quote:
      'They handled food for forty people at our office and the whole thing ran without me having to chase anyone.',
    name: 'Placeholder review',
    detail: 'Awaiting verified customer',
  },
  {
    quote:
      'The portions are honest and the pepper is real. It tastes like it was cooked for someone, not produced.',
    name: 'Placeholder review',
    detail: 'Awaiting verified customer',
  },
]

export const cateringServices = [
  {
    title: 'Event catering',
    body: 'Weddings, naming ceremonies, birthdays and anniversaries, served hot from our kitchen to your venue.',
  },
  {
    title: 'Corporate catering',
    body: 'Team lunches, board meetings and staff events, with per-head planning and a fixed delivery window.',
  },
  {
    title: 'Private celebrations',
    body: 'Smaller gatherings at home where you want the food handled and the table to look considered.',
  },
  {
    title: 'Large orders',
    body: 'Trays and coolers of a single dish, cooked to quantity for family gatherings and send-offs.',
  },
  {
    title: 'Custom food orders',
    body: 'Dishes prepared to a specific brief — talk to us about what the occasion needs.',
  },
] // TODO confirm which of these Hothobs actually offers; remove the rest.

export const occasions = [
  'Weddings',
  'Naming ceremonies',
  'Birthdays',
  'Office lunches',
  'Send-forths',
  'Sunday gatherings',
]

/**
 * The three panels the hero rotates through.
 *
 * TODO drop the real photographs into `public/hero/` at the paths below.
 * Until a file exists the slide falls back to a labelled placeholder tile, so
 * the page still works — but do not launch on placeholders.
 * Landscape-ish, roughly square crops work best (about 1000x950 or larger).
 */
export const heroSlides = [
  {
    id: 'pot',
    type: 'illustration',
    label: 'our cooking pot',
  },
  {
    id: 'catering',
    type: 'photo',
    src: '/hero/catering-event.jpg',
    // TODO write an alt description of the actual photograph used.
    alt: 'Hothobs Cuisines catering a table of guests at an event',
    caption: 'Catering for your occasion',
    label: 'a catering event',
    tone: 'deep',
    placeholder: 'Catering event photograph',
  },
  {
    id: 'dish',
    type: 'photo',
    src: '/hero/signature-dish.jpg',
    // TODO write an alt description of the actual photograph used.
    alt: 'A plated Hothobs Cuisines signature dish',
    caption: 'Straight from the pot',
    label: 'a signature dish',
    tone: 'gold',
    placeholder: 'Signature dish photograph',
  },
]

export const gallery = {
  categories: ['Food', 'Events', 'Behind the Scenes', 'People', 'Hothobs Moments'],
  // TODO replace with real Hothobs photography. `tone` drives the placeholder tile colour.
  items: [
    { id: 'g1', category: 'Food', caption: 'Party jollof, straight from the pot', tone: 'gold' },
    { id: 'g2', category: 'Food', caption: 'Egusi and pounded yam', tone: 'green' },
    { id: 'g3', category: 'Events', caption: 'Sunday service for forty', tone: 'deep' },
    { id: 'g4', category: 'Behind the Scenes', caption: 'Morning prep', tone: 'cream' },
    { id: 'g5', category: 'Food', caption: 'Small chops platter', tone: 'gold' },
    { id: 'g6', category: 'People', caption: 'The kitchen team', tone: 'green' },
    { id: 'g7', category: 'Hothobs Moments', caption: 'A table mid-meal', tone: 'deep' },
    { id: 'g8', category: 'Events', caption: 'Corporate lunch set-up', tone: 'cream' },
    { id: 'g9', category: 'Behind the Scenes', caption: 'Stock on the fire', tone: 'gold' },
    { id: 'g10', category: 'Food', caption: 'Peppered chicken', tone: 'green' },
    { id: 'g11', category: 'People', caption: 'Plating for service', tone: 'deep' },
    { id: 'g12', category: 'Hothobs Moments', caption: 'Second helpings', tone: 'cream' },
  ],
}
