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
  // Confirmed copy, taken from the About Us document supplied by Hothobs
  // (pdfs/AboutHothobs.pdf). Hothobs is a global-cuisine brand, not a
  // Nigerian-only one — keep any rewrite on that side of the line.
  positioning:
    'A culinary brand passionate about creating exceptional food inspired by the richness and diversity of global cuisine — Nigerian, French, Italian, Chinese and more — for everyday dining, sharing and special occasions.',
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

// Confirmed: the ordering terms printed on the bowls & trays menu
// (pdfs/HOTHOBS FOOD BOWLS AND TRAY MENU FEB2026.pdf, final page).
export const openingHours = [
  { days: 'Monday – Friday', hours: '8:00am – 5:00pm' },
  { days: 'Saturday – Sunday', hours: 'Weekend orders by arrangement' },
]

// Confirmed from the bowls & trays menu, as above. Payment is the one line
// that does NOT come from that PDF: the menu asks for a bank transfer with
// proof on WhatsApp, but this site takes payment online through Paystack,
// so the account details are deliberately not published here.
export const orderingInfo = [
  {
    title: 'Order a day ahead',
    body: 'All orders must be placed at least a day before — we don’t take same-day orders.',
  },
  {
    title: 'Ordering days',
    body: 'We take orders Monday to Friday, 8:00am to 5:00pm.',
  },
  {
    title: 'Delivery days',
    body: 'Deliveries go out on Tuesdays and Fridays only, scheduled when you order.',
  },
  {
    title: 'Weekend orders',
    body: 'A weekend order needs a minimum of 15 boxes.',
  },
  {
    title: 'Minimum orders',
    body:
      'Breakfast is priced per head for a minimum of 20 people. Rice takeaway packs have a minimum order of 20 packs. Bowls and trays are bulk orders only.',
  },
  {
    title: 'Getting it to you',
    body: 'For speed, we advise booking a ride through Uber or Gokada to collect your order.',
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

// ORDER MATTERS. Hero.jsx features the first entry on load and drops the
// other two into the side slots in the order they appear here: [1] is the
// left cut-out, [2] is the right one. Catering leads; Meals sits left and
// Soups right.
export const heroFeatures = [
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
  {
    id: 'meals',
    name: 'MEALS',
    photo: 'photo-1504674900247-0877df9cc836',
    // TODO write an alt description of the actual photograph used.
    alt: 'A full Hothobs plate, protein and sides, served hot',
    lede: 'Rice packs and food boxes — jollof, plantain and the proteins that finish it.',
    ledeTail: 'Orders Monday to Friday, 8am to 5pm. Minimum order 20 packs.',
    ctaLabel: 'SEE THE PACKS',
    ctaTo: '/menu/packs',
  },
  {
    id: 'soups',
    name: 'SOUPS',
    photo: 'photo-1596797038530-2c107229654b',
    // TODO write an alt description of the actual photograph used.
    alt: 'A wide pot of Hothobs soup cooking down on the fire',
    lede: 'Cooked long and seasoned properly, straight from the pot it was made in.',
    ledeTail: 'Sold by the litre and the tray, quoted by the kitchen.',
    ctaLabel: 'SEE THE BOWLS',
    ctaTo: '/menu/bowls#stew-soup',
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
