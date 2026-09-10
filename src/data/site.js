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
  instagram: 'https://instagram.com/hothobscuisines',
  facebook: 'https://facebook.com/hothobscuisines',
}

export const contact = {
  phone: '0818 648 6888',
  whatsapp: '2348186486888', // digits only, country code first
  email: 'hello@hothobscuisines.com', // TODO verify
  address: '5 Alake Onile-Ere Crescent, Lagos, Nigeria',
  mapQuery: '5 Alake Onile-Ere Crescent, Lagos, Nigeria',
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
    body: 'Paid online through Paystack — card, bank transfer or USSD. Your order is confirmed as soon as payment goes through.',
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
 * ─────────────────────────────────────────────────────────────
 *  THE HERO
 * ─────────────────────────────────────────────────────────────
 *  A fixed composition: exactly one feature is "on" at a time. Its
 *  photograph is the full-bleed backdrop and its name is the headline.
 *  The other two sit in the left and right slots, cropped by the screen
 *  edges — click one to promote it. The rotation is fully reversible.
 *
 *  Photography is licensed Unsplash stock standing in for Hothobs' own
 *  kitchen. TODO replace every `photo` id with real Hothobs photography
 *  and rewrite each `alt` to describe the picture actually used.
 *
 *  `backdrop` is a wide crop for the background, `cutout` a square crop
 *  for the circular side slot — same photograph, two framings.
 */
const unsplash = (id, w, h) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=72`

export const heroEyebrow = 'FROM THE POT'

export const heroFeatures = [
  {
    id: 'soups',
    name: 'SOUPS',
    photo: 'photo-1596797038530-2c107229654b',
    // TODO write an alt description of the actual photograph used.
    alt: 'A wide pot of Hothobs soup cooking down on the fire',
    lede: 'Cooked long and seasoned properly, straight from the pot it was made in.',
    ledeTail: 'Order before 4:00pm and it goes out the same day.',
    ctaLabel: 'ORDER NOW',
    ctaTo: '/menu?category=soups',
  },
  {
    id: 'grills',
    name: 'GRILLS',
    photo: 'photo-1555939594-58d7cb561ad1',
    // TODO write an alt description of the actual photograph used.
    alt: 'Peppered meat and skewers coming off the Hothobs grill',
    lede: 'Proteins by the piece or the portion, peppered and taken off the fire hot.',
    ledeTail: 'Order before 4:00pm and it goes out the same day.',
    ctaLabel: 'ORDER NOW',
    ctaTo: '/menu?category=proteins',
  },
  {
    id: 'catering',
    name: 'CATERING',
    photo: 'photo-1498837167922-ddd27525d352',
    // TODO write an alt description of the actual photograph used.
    alt: 'A Hothobs catering spread laid out across a long table',
    lede: 'Weddings, offices and Sunday gatherings, cooked to quantity and served hot.',
    ledeTail: 'Tell us the date and the headcount and we will plan it with you.',
    ctaLabel: 'PLAN AN EVENT',
    ctaTo: '/catering',
  },
].map((f) => ({
  ...f,
  backdrop: unsplash(f.photo, 1600, 900),
  cutout: unsplash(f.photo, 560, 560),
}))

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
