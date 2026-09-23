/**
 * ─────────────────────────────────────────────────────────────
 *  THE HOTHOBS MENU — transcribed from the supplied PDFs
 * ─────────────────────────────────────────────────────────────
 *  Nothing here is placeholder copy. Every dish, size and price is
 *  taken from the three menus Hothobs supplied, in pdfs/:
 *
 *    breakfast  "HOTHOBS BREAKFAST 2024-1.pdf"
 *    bowls      "HOTHOBS FOOD BOWLS AND TRAY MENU FEB2026.pdf"
 *    packs      "2026 HOTHOBS FOOD PACK AND BOXES MENU.pdf"
 *
 *  Re-check against the PDFs whenever a new edition is issued, and
 *  regenerate the backend's price list afterwards — see
 *  hothobs-backend/README.md, 'Regenerating prices'. A price that
 *  exists in only one of the two files is a bug: the customer sees
 *  one number and is charged another.
 *
 *  ── How a thing is ordered ──────────────────────────────────
 *  Everything on these menus is bought and paid for online. Where
 *  Hothobs prints an order minimum, the product carries `minQty`
 *  and the quantity control starts there and will not go below it —
 *  the server enforces the same floor, so it cannot be edited away
 *  in the browser. `unitNoun` is what that quantity counts: a
 *  breakfast is counted in people, a Black Pack in packs.
 *
 *  ── Product shape ───────────────────────────────────────────
 *    slug        unique url segment, unique across ALL menus
 *    menu        breakfast | bowls | packs
 *    category    must match a category id below
 *    name        display name
 *    blurb       one-line card description
 *    description longer copy for the product page
 *    includes    what comes in the pack/box/platter, as supplied
 *    portions    [{ id, label, price }] price in Naira
 *    minQty      order minimum, where the menu prints one (default 1)
 *    unitNoun    what the quantity counts (default 'portions')
 *    options     [{ id, label, choices: [{ id, label, price }] }]
 *    featured    shows on the homepage "Our Popular Picks"
 *    signature   shows in "Hothobs Favorites"
 *    tone        placeholder image tint: gold | green | deep | cream
 */

/**
 * The three menus, in the order they appear in the nav dropdown.
 *
 * `minimum` is the order minimum printed on the menu itself, shown on the
 * menu page because it is the single thing most likely to waste a
 * customer's time if they miss it. Where it is a number Hothobs actually
 * prints, the products carry `minQty` and it is enforced at checkout.
 */
export const menus = [
  {
    id: 'breakfast',
    name: 'Breakfast Menu',
    path: '/menu/breakfast',
    blurb: 'Nigerian, continental and mixed breakfast, priced per head.',
    minimum: 'Minimum of 20 people',
    source: 'HOTHOBS BREAKFAST 2024-1.pdf',
  },
  {
    id: 'bowls',
    name: 'Bowls Menu',
    path: '/menu/bowls',
    blurb: 'Rice, soups, pasta, grills and salads by the bowl, the litre and the tray.',
    minimum: 'Bulk orders only',
    source: 'HOTHOBS FOOD BOWLS AND TRAY MENU FEB2026.pdf',
  },
  {
    id: 'packs',
    name: 'Packs & Boxes',
    path: '/menu/packs',
    blurb: 'Takeaway rice packs and the A–D food boxes, for events and office runs.',
    minimum: 'Minimum order 20 packs',
    source: '2026 HOTHOBS FOOD PACK AND BOXES MENU.pdf',
  },
]

export const categories = [
  // Breakfast
  { id: 'breakfast-packages', menu: 'breakfast', name: 'Breakfast Packages', note: 'Per head, minimum of 20 people' },

  // Bowls & trays
  { id: 'rice', menu: 'bowls', name: 'Rice', note: 'By the litre or the tray' },
  { id: 'stew-soup', menu: 'bowls', name: 'Stew & Soup', note: 'Cooked long, sold by the litre' },
  { id: 'proteins', menu: 'bowls', name: 'Proteins', note: 'By the piece' },
  { id: 'grills-sides', menu: 'bowls', name: 'Grills & Sides', note: 'Per stick, or a tray of 25' },
  { id: 'pasta-noodles', menu: 'bowls', name: 'Pasta & Noodles', note: 'Bulk volumes and trays' },
  { id: 'pasta-boxes', menu: 'bowls', name: 'Pasta Boxes & Bowls', note: 'Single servings from the pasta price list' },
  { id: 'salads', menu: 'bowls', name: 'Salads', note: 'Bowls and trays' },
  { id: 'platters', menu: 'bowls', name: 'Platters', note: 'Half tray or full tray' },

  // Packs & boxes
  { id: 'rice-packs', menu: 'packs', name: 'Rice Takeaway Packs', note: 'Minimum order 20 packs' },
  { id: 'boxes', menu: 'packs', name: 'Food Boxes', note: 'Breakfast Box and Boxes A – D' },
  { id: 'pack-extras', menu: 'packs', name: 'Extras', note: 'Drinks and carrier bags' },
]

/** 3 litres / 5 litres / tray, the shape every rice dish is sold in. */
const riceSizes = (three, five, tray) => [
  { id: '3l', label: '3 litres', price: three },
  { id: '5l', label: '5 litres', price: five },
  { id: 'tray', label: 'Tray', price: tray },
]

/** 3 litres / 5 litres, the shape every stew and soup is sold in. */
const potSizes = (three, five) => [
  { id: '3l', label: '3 litres', price: three },
  { id: '5l', label: '5 litres', price: five },
]

/** A protein sold by the piece. */
const perPiece = (price) => [{ id: 'piece', label: 'Per piece', price }]

/** Off the grill: by the stick, or a tray of 25. */
const stickAndTray = (stick, tray) => [
  { id: 'stick', label: 'Per stick', price: stick },
  { id: 'tray', label: 'Tray (25 sticks)', price: tray },
]

/**
 * The bulk pasta table: one price ladder shared by every dish on it.
 *
 * Note this is NOT the same price list as the single-serve boxes and bowls
 * further down — the bowls PDF carries both, so the site carries both.
 */
const pastaVolumes = () => [
  { id: '500ml', label: '500ml', price: 10000 },
  { id: '1000ml', label: '1000ml', price: 18000 },
  { id: '3-5l', label: '3.5 litres', price: 53000 },
  { id: 'tray', label: 'Tray', price: 70000 },
]

/** The single-serve pasta price list: a box serves one, a bowl serves two. */
const pastaServings = (box, bowl) => [
  { id: 'box', label: 'Box (serves 1)', price: box },
  { id: 'bowl', label: 'Bowl (serves 2)', price: bowl },
]

/** A salad by the bowl, or on a medium or large tray. */
const saladSizes = (bowl, medium, large) => [
  { id: 'bowl', label: 'Bowl', price: bowl },
  { id: 'medium-tray', label: 'Medium tray', price: medium },
  { id: 'large-tray', label: 'Large tray', price: large },
]

export const products = [
  /* ── Breakfast ─────────────────────────────────────────────
     Priced per head with a minimum of 20 people, so all three are
     quoted rather than shopped. */
  {
    slug: 'nigerian-breakfast',
    menu: 'breakfast',
    category: 'breakfast-packages',
    name: 'Nigerian Breakfast',
    blurb: 'Yam, plantain, sweet potatoes and the sauces that go with them.',
    description:
      'Our Nigerian breakfast spread, served for a minimum of twenty people and priced per head.',
    includes: [
      'Boiled yam',
      'Boiled plantain',
      'Fried sweet potatoes',
      'White & wheat bread',
      'Egg sauce',
      'Fried eggs (omelette)',
      'Fried & stewed chicken wings',
      'Corned beef stew',
      'Fish sauce / liver sauce',
      'Salad',
      'Assorted tea',
    ],
    portions: [{ id: 'per-head', label: 'Per head', price: 10000 }],
    minQty: 20,
    unitNoun: 'people',
    options: [],
    featured: false,
    signature: false,
    tone: 'gold',
  },
  {
    slug: 'continental-breakfast',
    menu: 'breakfast',
    category: 'breakfast-packages',
    name: 'Continental Breakfast',
    blurb: 'Sandwiches, pastries, eggs, sausages and grills.',
    description:
      'The continental spread, served for a minimum of twenty people and priced per head.',
    includes: [
      'Irish potatoes',
      'Chicken / egg / fish sandwiches',
      'Croissants / baguette / bread rolls',
      'Pancakes / waffles',
      'Poached eggs',
      'Scrambled eggs / omelette',
      'Sausages — beef / chicken / pork',
      'Grilled wings',
      'Ham / bacon',
      'Salad',
      'Mince meat stew',
      'Baked beans',
      'Grilled mushroom',
      'Grilled tomato',
    ],
    portions: [{ id: 'per-head', label: 'Per head', price: 15000 }],
    minQty: 20,
    unitNoun: 'people',
    options: [],
    featured: false,
    signature: false,
    tone: 'cream',
  },
  {
    slug: 'mix-breakfast',
    menu: 'breakfast',
    category: 'breakfast-packages',
    name: 'Mix Breakfast',
    blurb: 'The full table — Nigerian and continental together.',
    description:
      'Both spreads on one table, served for a minimum of twenty people and priced per head.',
    includes: [
      'Beans',
      'Yam',
      'Plantain',
      'Irish potato',
      'Wheat bread',
      'Bread rolls',
      'Croissant',
      'Sausage rolls',
      'Scotch eggs',
      'Meat pie / chicken pie',
      'Chicken wings',
      'Mince meat sauce',
      'Fish sauce',
      'Egg sauce',
      'Plain eggs / poached eggs',
      'Salad',
      'Baked beans',
      'Sausages',
      'Bacon / ham',
      'Grilled tomatoes',
      'Sautéed mushroom',
      'Fruits',
      'Assorted tea',
    ],
    portions: [{ id: 'per-head', label: 'Per head', price: 20000 }],
    minQty: 20,
    unitNoun: 'people',
    options: [],
    featured: true,
    signature: false,
    tone: 'green',
  },

  /* ── Bowls: rice ───────────────────────────────────────────
     On the bowls menu a tray and 5 litres are the same money. That is
     how the PDF prices them; it is not a transcription slip. */
  {
    slug: 'jollof-rice',
    menu: 'bowls',
    category: 'rice',
    name: 'Jollof Rice',
    blurb: 'The party pot, by the litre or the tray.',
    description: 'Our jollof, cooked to quantity and packed hot.',
    includes: [],
    portions: riceSizes(45000, 75000, 75000),
    options: [],
    featured: true,
    signature: false,
    tone: 'gold',
  },
  {
    slug: 'fried-rice',
    menu: 'bowls',
    category: 'rice',
    name: 'Fried Rice',
    blurb: 'Vegetables through it, cooked in stock.',
    description: 'Fried rice, cooked to quantity and packed hot.',
    includes: [],
    portions: riceSizes(45000, 75000, 75000),
    options: [],
    featured: false,
    signature: false,
    tone: 'green',
  },
  {
    slug: 'chicken-coconut-rice',
    menu: 'bowls',
    category: 'rice',
    name: 'Chicken Coconut Rice',
    blurb: 'Coconut rice cooked down with chicken.',
    description: 'Coconut rice with chicken, by the litre or the tray.',
    includes: [],
    portions: riceSizes(66000, 110000, 110000),
    options: [],
    featured: false,
    signature: false,
    tone: 'cream',
  },
  {
    slug: 'seafood-coconut-rice',
    menu: 'bowls',
    category: 'rice',
    name: 'Seafood Coconut Rice',
    blurb: 'Coconut rice with seafood through it.',
    description: 'Coconut rice with seafood, by the litre or the tray.',
    includes: [],
    portions: riceSizes(75000, 125000, 125000),
    options: [],
    featured: false,
    signature: false,
    tone: 'deep',
  },
  {
    slug: 'seafood-rice',
    menu: 'bowls',
    category: 'rice',
    name: 'Seafood Rice',
    blurb: 'Rice cooked with prawns and fish.',
    description: 'Seafood rice, by the litre or the tray.',
    includes: [],
    portions: riceSizes(75000, 125000, 125000),
    options: [],
    featured: false,
    signature: false,
    tone: 'gold',
  },
  {
    slug: 'asun-rice',
    menu: 'bowls',
    category: 'rice',
    name: 'Asun Rice',
    blurb: 'Rice with peppered smoked goat through it.',
    description: 'Asun rice, by the litre or the tray.',
    includes: [],
    portions: riceSizes(66000, 110000, 110000),
    options: [],
    featured: false,
    signature: true,
    tone: 'deep',
  },
  {
    slug: 'jambalaya-rice',
    menu: 'bowls',
    category: 'rice',
    name: 'Jambalaya Rice',
    blurb: 'Smoky, spiced and cooked in one pot.',
    description: 'Jambalaya rice, by the litre or the tray.',
    includes: [],
    portions: riceSizes(60000, 100000, 100000),
    options: [],
    featured: false,
    signature: false,
    tone: 'green',
  },
  {
    slug: 'village-rice',
    menu: 'bowls',
    category: 'rice',
    name: 'Village Rice',
    blurb: 'Local rice, cooked the long way.',
    description: 'Village rice, by the litre or the tray.',
    includes: [],
    portions: riceSizes(75000, 140000, 140000),
    options: [],
    featured: false,
    signature: false,
    tone: 'cream',
  },
  {
    slug: 'asaro-yam-pottage',
    menu: 'bowls',
    category: 'rice',
    name: 'Asaro (Yam Pottage)',
    blurb: 'Yam cooked down soft in pepper and palm oil.',
    description: 'Asaro, by the litre or the tray.',
    includes: [],
    portions: riceSizes(30000, 50000, 50000),
    options: [],
    featured: false,
    signature: false,
    tone: 'gold',
  },

  /* ── Bowls: stew & soup ────────────────────────────────────
     3 and 5 litres only — no tray price on this page of the menu. */
  {
    slug: 'efo-riro',
    menu: 'bowls',
    category: 'stew-soup',
    name: 'Efo Riro',
    blurb: 'Spinach cooked down in pepper and locust bean.',
    description: 'Efo riro, sold by the litre.',
    includes: [],
    portions: potSizes(45000, 75000),
    options: [],
    featured: false,
    signature: true,
    tone: 'green',
  },
  {
    slug: 'efo-elegusi',
    menu: 'bowls',
    category: 'stew-soup',
    name: 'Efo Elegusi',
    blurb: 'Efo with melon seed through it.',
    description: 'Efo elegusi, sold by the litre.',
    includes: [],
    portions: potSizes(45000, 75000),
    options: [],
    featured: false,
    signature: false,
    tone: 'gold',
  },
  {
    slug: 'egusi-ijebu',
    menu: 'bowls',
    category: 'stew-soup',
    name: 'Egusi Ijebu',
    blurb: 'Melon seed soup, cooked Ijebu style.',
    description: 'Egusi ijebu, sold by the litre.',
    includes: [],
    portions: potSizes(45000, 75000),
    options: [],
    featured: false,
    signature: false,
    tone: 'cream',
  },
  {
    slug: 'edikainkong',
    menu: 'bowls',
    category: 'stew-soup',
    name: 'Edikaikong',
    blurb: 'Waterleaf and ugu, thick with assorted meat.',
    description: 'Edikaikong, sold by the litre.',
    includes: [],
    portions: potSizes(45000, 75000),
    options: [],
    featured: false,
    signature: false,
    tone: 'deep',
  },
  {
    slug: 'afang',
    menu: 'bowls',
    category: 'stew-soup',
    name: 'Afang',
    blurb: 'Afang leaf and waterleaf, cooked long.',
    description: 'Afang, sold by the litre.',
    includes: [],
    portions: potSizes(45000, 75000),
    options: [],
    featured: false,
    signature: false,
    tone: 'green',
  },
  {
    slug: 'ofada-sauce',
    menu: 'bowls',
    category: 'stew-soup',
    name: 'Ofada Sauce',
    blurb: 'Green pepper sauce with assorted meat.',
    description: 'Ofada sauce, sold by the litre.',
    includes: [],
    portions: potSizes(45000, 75000),
    options: [],
    featured: false,
    signature: false,
    tone: 'gold',
  },
  {
    slug: 'oha-soup',
    menu: 'bowls',
    category: 'stew-soup',
    name: 'Oha Soup',
    blurb: 'Oha leaf, thickened and seasoned properly.',
    description: 'Oha soup, sold by the litre.',
    includes: [],
    portions: potSizes(45000, 75000),
    options: [],
    featured: false,
    signature: false,
    tone: 'cream',
  },
  {
    slug: 'ogbono-soup',
    menu: 'bowls',
    category: 'stew-soup',
    name: 'Ogbono Soup',
    blurb: 'Drawn thick, with assorted meat.',
    description: 'Ogbono soup, sold by the litre.',
    includes: [],
    portions: potSizes(45000, 75000),
    options: [],
    featured: false,
    signature: false,
    tone: 'deep',
  },
  {
    slug: 'seafood-soup',
    menu: 'bowls',
    category: 'stew-soup',
    name: 'Seafood Soup',
    blurb: 'Prawns, fish and shellfish in one pot.',
    description: 'Seafood soup, sold by the litre.',
    includes: [],
    portions: potSizes(75000, 140000),
    options: [],
    featured: false,
    signature: false,
    tone: 'green',
  },
  {
    slug: 'assorted-beef-okro',
    menu: 'bowls',
    category: 'stew-soup',
    name: 'Assorted Beef Okro',
    blurb: 'Okro with assorted beef through it.',
    description: 'Assorted beef okro, sold by the litre.',
    includes: [],
    portions: potSizes(45000, 75000),
    options: [],
    featured: false,
    signature: false,
    tone: 'gold',
  },
  {
    slug: 'fried-beef-stew',
    menu: 'bowls',
    category: 'stew-soup',
    name: 'Fried Beef Stew',
    blurb: 'Beef fried into a proper stew base.',
    description: 'Fried beef stew, sold by the litre.',
    includes: [],
    portions: potSizes(35000, 60000),
    options: [],
    featured: false,
    signature: false,
    tone: 'deep',
  },
  {
    slug: 'fried-chicken-stew',
    menu: 'bowls',
    category: 'stew-soup',
    name: 'Fried Chicken Stew',
    blurb: 'Chicken fried and finished in stew.',
    description: 'Fried chicken stew, sold by the litre.',
    includes: [],
    portions: potSizes(55000, 100000),
    options: [],
    featured: false,
    signature: false,
    tone: 'cream',
  },
  {
    slug: 'fried-fish-stew',
    menu: 'bowls',
    category: 'stew-soup',
    name: 'Fried Fish Stew',
    blurb: 'Fish fried, then stewed down.',
    description: 'Fried fish stew, sold by the litre.',
    includes: [],
    portions: potSizes(60000, 120000),
    options: [],
    featured: false,
    signature: false,
    tone: 'green',
  },
  {
    slug: 'fish-pepper-soup',
    menu: 'bowls',
    category: 'stew-soup',
    name: 'Fish Pepper Soup',
    blurb: 'Hot, light and properly peppered.',
    description: 'Fish pepper soup, sold by the litre.',
    includes: [],
    portions: potSizes(55000, 100000),
    options: [],
    featured: false,
    signature: false,
    tone: 'gold',
  },
  {
    slug: 'goat-meat-pepper-soup',
    menu: 'bowls',
    category: 'stew-soup',
    name: 'Goat Meat Pepper Soup',
    blurb: 'Goat meat cooked down in pepper soup spice.',
    description: 'Goat meat pepper soup, sold by the litre.',
    includes: [],
    portions: potSizes(60000, 110000),
    options: [],
    featured: false,
    signature: true,
    tone: 'deep',
  },

  /* ── Bowls: proteins ───────────────────────────────────────
     By the piece, so these are the shoppable end of the bowls menu. */
  {
    slug: 'grilled-pepper-turkey',
    menu: 'bowls',
    category: 'proteins',
    name: 'Grilled Pepper Turkey',
    blurb: 'Turkey grilled and finished in pepper.',
    description: 'Grilled pepper turkey, sold by the piece.',
    includes: [],
    portions: perPiece(6000),
    options: [],
    featured: false,
    signature: false,
    tone: 'deep',
  },
  {
    slug: 'grilled-pepper-chicken',
    menu: 'bowls',
    category: 'proteins',
    name: 'Grilled Pepper Chicken',
    blurb: 'Chicken grilled and finished in pepper.',
    description: 'Grilled pepper chicken, sold by the piece.',
    includes: [],
    portions: perPiece(5000),
    options: [],
    featured: false,
    signature: false,
    tone: 'gold',
  },
  {
    slug: 'sauteed-beef-with-pepper',
    menu: 'bowls',
    category: 'proteins',
    name: 'Sautéed Beef with Pepper',
    blurb: 'Beef sautéed hot with pepper and onion.',
    description: 'Sautéed beef with pepper, sold by the piece.',
    includes: [],
    portions: perPiece(3000),
    options: [],
    featured: false,
    signature: false,
    tone: 'green',
  },
  {
    slug: 'sauteed-croaker-fish',
    menu: 'bowls',
    category: 'proteins',
    name: 'Sautéed Croaker Fish',
    blurb: 'Croaker, sautéed and seasoned.',
    description: 'Sautéed croaker fish, sold by the piece.',
    includes: [],
    portions: perPiece(5000),
    options: [],
    featured: false,
    signature: false,
    tone: 'cream',
  },
  {
    slug: 'sauteed-hake-fish',
    menu: 'bowls',
    category: 'proteins',
    name: 'Sautéed Hake Fish',
    blurb: 'Hake, sautéed and seasoned.',
    description: 'Sautéed hake fish, sold by the piece.',
    includes: [],
    portions: perPiece(4000),
    options: [],
    featured: false,
    signature: false,
    tone: 'deep',
  },
  {
    slug: 'peppered-snails',
    menu: 'bowls',
    category: 'proteins',
    name: 'Peppered Snails',
    blurb: 'Snails in a hot pepper sauce.',
    description: 'Peppered snails, sold by the piece.',
    includes: [],
    portions: perPiece(5000),
    options: [],
    featured: false,
    signature: false,
    tone: 'green',
  },
  {
    slug: 'grilled-prawns-spicy',
    menu: 'bowls',
    category: 'proteins',
    name: 'Grilled Prawns (Spicy)',
    blurb: 'Prawns grilled hot and spiced.',
    description: 'Spicy grilled prawns, sold by the piece.',
    includes: [],
    portions: perPiece(4500),
    options: [],
    featured: false,
    signature: false,
    tone: 'gold',
  },
  {
    slug: 'moinmoin',
    menu: 'bowls',
    category: 'proteins',
    name: 'Moinmoin',
    blurb: 'Steamed bean pudding.',
    description: 'Moinmoin, sold by the piece.',
    includes: [],
    portions: perPiece(2000),
    options: [],
    featured: false,
    signature: false,
    tone: 'cream',
  },

  /* ── Bowls: grills & sides ─────────────────────────────────
     A stick goes in the cart; a tray of 25 is quoted. */
  {
    slug: 'gizdodo',
    menu: 'bowls',
    category: 'grills-sides',
    name: 'Gizdodo',
    blurb: 'Gizzard and plantain in pepper sauce.',
    description: 'Gizdodo, per stick or by the tray of 25.',
    includes: [],
    portions: stickAndTray(2000, 45000),
    options: [],
    featured: false,
    signature: true,
    tone: 'gold',
  },
  {
    slug: 'crispy-chicken-wings',
    menu: 'bowls',
    category: 'grills-sides',
    name: 'Crispy Chicken Wings',
    blurb: 'Fried crisp, seasoned through.',
    description: 'Crispy chicken wings, per stick or by the tray of 25.',
    includes: [],
    portions: stickAndTray(1500, 30000),
    options: [],
    featured: false,
    signature: false,
    tone: 'deep',
  },
  {
    slug: 'whole-dressed-chicken',
    menu: 'bowls',
    category: 'grills-sides',
    name: 'Whole Dressed Chicken',
    blurb: 'Dressed and grilled whole.',
    description: 'Whole dressed chicken, per stick or by the tray of 25.',
    includes: [],
    portions: stickAndTray(1200, 25000),
    options: [],
    featured: false,
    signature: false,
    tone: 'green',
  },
  {
    slug: 'chicken-lollipop',
    menu: 'bowls',
    category: 'grills-sides',
    name: 'Chicken Lollipop',
    blurb: 'Crispy or grilled, your choice.',
    description: 'Chicken lollipop, per stick or by the tray of 25.',
    includes: [],
    portions: stickAndTray(2000, 45000),
    options: [
      {
        id: 'style',
        label: 'Crispy or grilled',
        choices: [
          { id: 'crispy', label: 'Crispy', price: 0 },
          { id: 'grilled', label: 'Grilled', price: 0 },
        ],
      },
    ],
    featured: false,
    signature: false,
    tone: 'cream',
  },
  {
    // The menu prices this tray by size, as a range (₦22,500 – ₦30,000).
    // A range cannot be charged, so the low end is carried here and both
    // the label and the description say so. Confirm the figures with
    // Hothobs and replace this with a real price per size.
    slug: 'spicy-basil-chilli-meatballs',
    menu: 'bowls',
    category: 'grills-sides',
    name: 'Spicy Basil Chilli Meatballs',
    blurb: 'Meatballs in basil and chilli. Tray priced by size.',
    description:
      'Spicy basil chilli meatballs, by the tray of 25 sticks. The menu prices this one by size, from ₦22,500 to ₦30,000 — we confirm the exact tray when we quote.',
    includes: [],
    portions: [
      { id: 'tray', label: 'Tray (25 sticks) — from, priced by size', price: 22500 },
    ],
    options: [],
    featured: false,
    signature: false,
    tone: 'deep',
  },

  /* ── Bowls: pasta & noodles (bulk) ─────────────────────────
     The bowls menu's volume ladder. The single-serve price list for
     several of these dishes follows in 'pasta-boxes' — both are on
     the PDF, so both are here. */
  {
    slug: 'singapore-noodles-chicken',
    menu: 'bowls',
    category: 'pasta-noodles',
    name: 'Singapore Noodles (Chicken)',
    blurb: 'Curried noodles with chicken through them.',
    description: 'Singapore noodles with chicken, by volume or the tray.',
    includes: [],
    portions: pastaVolumes(),
    options: [],
    featured: false,
    signature: false,
    tone: 'gold',
  },
  {
    slug: 'creamy-chicken-pasta-bulk',
    menu: 'bowls',
    category: 'pasta-noodles',
    name: 'Creamy Chicken Pasta (Bulk)',
    blurb: 'The bulk ladder, 500ml up to a tray.',
    description: 'Creamy chicken pasta, by volume or the tray.',
    includes: [],
    portions: pastaVolumes(),
    options: [],
    featured: false,
    signature: false,
    tone: 'cream',
  },
  {
    slug: 'tomato-chicken-pasta-bulk',
    menu: 'bowls',
    category: 'pasta-noodles',
    name: 'Tomato Chicken Pasta (Bulk)',
    blurb: 'The bulk ladder, 500ml up to a tray.',
    description: 'Tomato chicken pasta, by volume or the tray.',
    includes: [],
    portions: pastaVolumes(),
    options: [],
    featured: false,
    signature: false,
    tone: 'green',
  },
  {
    slug: 'creamy-seafood-pasta-bulk',
    menu: 'bowls',
    category: 'pasta-noodles',
    name: 'Creamy Seafood Pasta (Bulk)',
    blurb: 'The bulk ladder, 500ml up to a tray.',
    description: 'Creamy seafood pasta, by volume or the tray.',
    includes: [],
    portions: pastaVolumes(),
    options: [],
    featured: false,
    signature: false,
    tone: 'deep',
  },
  {
    slug: 'tomato-seafood-pasta-bulk',
    menu: 'bowls',
    category: 'pasta-noodles',
    name: 'Tomato Seafood Pasta (Bulk)',
    blurb: 'The bulk ladder, 500ml up to a tray.',
    description: 'Tomato seafood pasta, by volume or the tray.',
    includes: [],
    portions: pastaVolumes(),
    options: [],
    featured: false,
    signature: false,
    tone: 'gold',
  },
  {
    slug: 'spaghetti-meatballs-bulk',
    menu: 'bowls',
    category: 'pasta-noodles',
    name: 'Spaghetti & Meatballs (Bulk)',
    blurb: 'The bulk ladder, 500ml up to a tray.',
    description: 'Spaghetti and meatballs, by volume or the tray.',
    includes: [],
    portions: pastaVolumes(),
    options: [],
    featured: false,
    signature: false,
    tone: 'cream',
  },

  /* ── Bowls: pasta boxes & bowls (single serve) ─────────────
     The separate "Pasta Price List" page. A box serves one, a bowl two. */
  {
    slug: 'creamy-chicken-pasta',
    menu: 'bowls',
    category: 'pasta-boxes',
    name: 'Creamy Chicken Pasta',
    blurb: 'Box for one, bowl for two.',
    description: 'Creamy chicken pasta from the pasta price list.',
    includes: [],
    portions: pastaServings(10000, 18000),
    options: [],
    featured: true,
    signature: false,
    tone: 'cream',
  },
  {
    slug: 'creamy-seafood-pasta',
    menu: 'bowls',
    category: 'pasta-boxes',
    name: 'Creamy Seafood Pasta',
    blurb: 'Box for one, bowl for two.',
    description: 'Creamy seafood pasta from the pasta price list.',
    includes: [],
    portions: pastaServings(10000, 18000),
    options: [],
    featured: false,
    signature: false,
    tone: 'deep',
  },
  {
    slug: 'tomato-chicken-pasta',
    menu: 'bowls',
    category: 'pasta-boxes',
    name: 'Tomato Chicken Pasta',
    blurb: 'Box for one, bowl for two.',
    description: 'Tomato chicken pasta from the pasta price list.',
    includes: [],
    portions: pastaServings(10000, 18000),
    options: [],
    featured: false,
    signature: false,
    tone: 'green',
  },
  {
    slug: 'tomato-seafood-pasta',
    menu: 'bowls',
    category: 'pasta-boxes',
    name: 'Tomato Seafood Pasta',
    blurb: 'Box for one, bowl for two.',
    description: 'Tomato seafood pasta from the pasta price list.',
    includes: [],
    portions: pastaServings(10000, 18000),
    options: [],
    featured: false,
    signature: false,
    tone: 'gold',
  },
  {
    slug: 'spicy-chicken-sausage-spaghetti',
    menu: 'bowls',
    category: 'pasta-boxes',
    name: 'Spicy Chicken Sausage Spaghetti',
    blurb: 'Box for one, bowl for two.',
    description: 'Spicy chicken sausage spaghetti from the pasta price list.',
    includes: [],
    portions: pastaServings(10000, 18000),
    options: [],
    featured: false,
    signature: false,
    tone: 'deep',
  },
  {
    slug: 'spicy-spaghetti-meatballs',
    menu: 'bowls',
    category: 'pasta-boxes',
    name: 'Spicy Spaghetti & Meatballs',
    blurb: 'Box for one, bowl for two.',
    description: 'Spicy spaghetti and meatballs from the pasta price list.',
    includes: [],
    portions: pastaServings(10000, 18000),
    options: [],
    featured: false,
    signature: false,
    tone: 'cream',
  },

  /* ── Bowls: salads ─────────────────────────────────────────
     Bowl in the cart, trays quoted. */
  {
    slug: 'grilled-chicken-salad',
    menu: 'bowls',
    category: 'salads',
    name: 'Grilled Chicken Salad',
    blurb: 'Grilled chicken over leaves, by the bowl or the tray.',
    description: 'Grilled chicken salad — a bowl, or a medium or large tray.',
    includes: [],
    portions: saladSizes(10000, 45000, 55000),
    options: [],
    featured: true,
    signature: false,
    tone: 'green',
  },
  {
    slug: 'grilled-mackerel-fish-salad',
    menu: 'bowls',
    category: 'salads',
    name: 'Grilled Mackerel Fish Salad',
    blurb: 'Grilled mackerel over leaves, by the bowl or the tray.',
    description: 'Grilled mackerel fish salad — a bowl, or a medium or large tray.',
    includes: [],
    portions: saladSizes(10000, 45000, 55000),
    options: [],
    featured: false,
    signature: false,
    tone: 'cream',
  },
  {
    slug: 'spicy-shrimp-salad',
    menu: 'bowls',
    category: 'salads',
    name: 'Spicy Shrimp Salad',
    blurb: 'Spiced shrimp over leaves, by the bowl or the tray.',
    description: 'Spicy shrimp salad — a bowl, or a medium or large tray.',
    includes: [],
    portions: saladSizes(10000, 45000, 55000),
    options: [],
    featured: false,
    signature: true,
    tone: 'gold',
  },

  /* ── Bowls: platters ───────────────────────────────────────*/
  {
    slug: 'hh-platter',
    menu: 'bowls',
    category: 'platters',
    name: 'HH Platter',
    blurb: 'Kebabs, lollipop, prawns, fish, meatballs and fries.',
    description: 'The house platter, as a half tray or a full tray.',
    includes: [
      'Beef kebabs',
      'Chicken lollipop',
      'Grilled prawns',
      'Fish in batter',
      'Meatballs',
      'Fries (plantain or potatoes)',
    ],
    portions: [
      { id: 'half-tray', label: 'Half tray', price: 65000 },
      { id: 'full-tray', label: 'Full tray', price: 120000 },
    ],
    options: [],
    featured: false,
    signature: true,
    tone: 'deep',
  },

  /* ── Packs: rice takeaway ──────────────────────────────────
     Minimum order 20 packs, so the pack itself is quoted. */
  {
    slug: 'black-pack',
    menu: 'packs',
    category: 'rice-packs',
    name: 'Black Pack',
    blurb: 'Jollof rice or spaghetti, plantain and your proteins.',
    description:
      'The takeaway pack, built on jollof rice or spaghetti with plantain. Choose how many proteins go in. Minimum order 20 packs.',
    includes: ['Jollof rice or spaghetti', 'Plantain', 'Protein'],
    portions: [
      { id: '1-protein', label: '1 protein', price: 5500 },
      { id: '2-protein', label: '2 proteins', price: 7500 },
      { id: '3-protein', label: '3 proteins', price: 10000 },
    ],
    minQty: 20,
    unitNoun: 'packs',
    options: [
      {
        id: 'base',
        label: 'Rice or spaghetti',
        choices: [
          { id: 'jollof', label: 'Jollof rice', price: 0 },
          { id: 'spaghetti', label: 'Spaghetti', price: 0 },
        ],
      },
    ],
    featured: true,
    signature: false,
    tone: 'gold',
  },

  /* ── Packs: the boxes ──────────────────────────────────────*/
  {
    slug: 'breakfast-box',
    menu: 'packs',
    category: 'boxes',
    name: 'Breakfast Box',
    blurb: 'Club sandwich, finger food, fruit and a pastry.',
    description: 'The breakfast box, packed and sealed for the morning.',
    includes: [
      'Club sandwich (1)',
      'Pastry (1)',
      'Finger food (fish fillet / chicken lollipop / beef kebab)',
      'Water (1)',
      'Fruit (1)',
    ],
    portions: [{ id: 'box', label: 'Per box', price: 10000 }],
    options: [],
    featured: false,
    signature: false,
    tone: 'cream',
  },
  {
    slug: 'box-a',
    menu: 'packs',
    category: 'boxes',
    name: 'Box A',
    blurb: 'Jollof rice with a side, two proteins, fruit and drinks.',
    description: 'Box A, packed and sealed.',
    includes: [
      'Jollof rice with a side (moinmoin / dodo)',
      'Protein (2)',
      'Cookies / cup cake (1)',
      'Fruit (1)',
      'Water',
      'Carbonated drink',
    ],
    portions: [{ id: 'box', label: 'Per box', price: 15000 }],
    options: [],
    featured: false,
    signature: false,
    tone: 'green',
  },
  {
    slug: 'box-b',
    menu: 'packs',
    category: 'boxes',
    name: 'Box B',
    blurb: 'Box A, with a canned drink and fruit juice.',
    description: 'Box B, packed and sealed.',
    includes: [
      'Jollof rice with a side (moinmoin / dodo)',
      'Protein (2)',
      'Cookies / cup cakes (1)',
      'Fruit (1)',
      'Canned drink',
      'Fruit juice (1)',
    ],
    portions: [{ id: 'box', label: 'Per box', price: 20000 }],
    options: [],
    featured: false,
    signature: false,
    tone: 'deep',
  },
  {
    slug: 'box-c',
    menu: 'packs',
    category: 'boxes',
    name: 'Box C',
    blurb: 'Three proteins, finger food, muffins and a meal option.',
    description: 'Box C, packed and sealed.',
    includes: [
      'Jollof rice with a side (moinmoin / dodo)',
      'Protein (3)',
      'Fruit (1)',
      'Fruit juice (1)',
      'Finger food',
      'Cookies (1)',
      'Muffins (1)',
      'Canned drink',
      '1 meal option',
    ],
    portions: [{ id: 'box', label: 'Per box', price: 35000 }],
    options: [],
    featured: false,
    signature: false,
    tone: 'gold',
  },
  {
    slug: 'box-d',
    menu: 'packs',
    category: 'boxes',
    name: 'Box D',
    blurb: 'The full box — four proteins, wine and two meal options.',
    description: 'Box D, packed and sealed.',
    includes: [
      'Jollof rice / spaghetti / ofada rice and stew, with a side (moinmoin / dodo)',
      'Protein (4)',
      'Fruit (2)',
      'Fruit juice (1)',
      'Finger food',
      'Cookies (1)',
      'Muffin in box (1)',
      'Wine (1)',
      'Water (1)',
      '2 meal options',
    ],
    portions: [{ id: 'box', label: 'Per box', price: 45000 }],
    options: [],
    featured: true,
    signature: false,
    tone: 'deep',
  },

  /* ── Packs: extras ─────────────────────────────────────────
     Sold singly alongside a pack, so these are shoppable. */
  {
    slug: 'bottled-water',
    menu: 'packs',
    category: 'pack-extras',
    name: 'Water',
    blurb: 'Bottled water.',
    description: 'Bottled water, added to a pack.',
    includes: [],
    portions: [{ id: 'bottle', label: 'Per bottle', price: 300 }],
    options: [],
    featured: false,
    signature: false,
    tone: 'cream',
  },
  {
    slug: 'pet-coke',
    menu: 'packs',
    category: 'pack-extras',
    name: 'Pet Coke',
    blurb: 'Soft drink in a pet bottle.',
    description: 'A pet bottle of Coke, added to a pack.',
    includes: [],
    portions: [{ id: 'bottle', label: 'Per bottle', price: 600 }],
    options: [],
    featured: false,
    signature: false,
    tone: 'deep',
  },
  {
    slug: 'canned-drink',
    menu: 'packs',
    category: 'pack-extras',
    name: 'Canned Drink',
    blurb: 'Chilled, by the can.',
    description: 'A canned drink, added to a pack.',
    includes: [],
    portions: [{ id: 'can', label: 'Per can', price: 1000 }],
    options: [],
    featured: false,
    signature: false,
    tone: 'gold',
  },
  {
    slug: 'non-alcoholic-wine',
    menu: 'packs',
    category: 'pack-extras',
    name: 'Non-Alcoholic Wine (Small)',
    blurb: 'A small bottle, for the boxes that carry wine.',
    description: 'A small bottle of non-alcoholic wine.',
    includes: [],
    portions: [{ id: 'small', label: 'Small bottle', price: 4000 }],
    options: [],
    featured: false,
    signature: false,
    tone: 'green',
  },
  {
    slug: 'carrier-bag',
    menu: 'packs',
    category: 'pack-extras',
    name: 'Carrier Bag',
    blurb: 'To carry the packs out in.',
    description: 'A branded carrier bag.',
    includes: [],
    portions: [{ id: 'bag', label: 'Per bag', price: 700 }],
    options: [],
    featured: false,
    signature: false,
    tone: 'cream',
  },
]

export const getProduct = (slug) => products.find((p) => p.slug === slug)
export const byCategory = (id) => products.filter((p) => p.category === id)
export const byMenu = (id) => products.filter((p) => p.menu === id)
export const categoriesOf = (menuId) => categories.filter((c) => c.menu === menuId)
export const featured = () => products.filter((p) => p.featured)
export const signature = () => products.filter((p) => p.signature)
export const categoryName = (id) => categories.find((c) => c.id === id)?.name ?? id
export const getMenu = (id) => menus.find((m) => m.id === id)
export const menuName = (id) => getMenu(id)?.name ?? id

/** The order minimum Hothobs prints for this dish, if any. */
export const minQtyOf = (product) => product.minQty ?? 1

/** What that quantity counts — people, packs, or plain portions. */
export const unitNounOf = (product) => product.unitNoun ?? 'portions'

/** The price we lead with on a card: the cheapest size it comes in. */
export const fromPortion = (product) => product.portions[0]

/**
 * True when the choice cannot be made from a card.
 *
 * A size to pick, an option to set, an order minimum to meet or a list of
 * contents worth reading all mean the product page has to do the work —
 * a one-tap "add" would be guessing on the customer's behalf.
 */
export const needsChoosing = (product) =>
  product.portions.length > 1 ||
  product.options.length > 0 ||
  product.includes.length > 0 ||
  minQtyOf(product) > 1

export const naira = (amount) =>
  `₦${Number(amount).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`
