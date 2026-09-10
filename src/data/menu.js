/**
 * ─────────────────────────────────────────────────────────────
 *  PLACEHOLDER MENU — VERIFY BEFORE LAUNCH
 * ─────────────────────────────────────────────────────────────
 *  Product names, descriptions, portions and prices below are
 *  structural placeholders so the ordering flow can be built and
 *  tested. Every one must be replaced with the real Hothobs menu
 *  before this site goes live.
 *
 *  Product shape:
 *    slug        unique url segment
 *    name        display name
 *    category    must match a category id below
 *    blurb       one-line card description
 *    description longer copy for the product page
 *    portions    [{ id, label, price }] price in Naira, kobo ignored
 *    options     [{ id, label, choices: [{ id, label, price }] }]
 *    featured    shows on the homepage "Our Popular Picks"
 *    signature   shows in "Hothobs Favorites"
 *    tone        placeholder image tint: gold | green | deep | cream
 */

export const categories = [
  { id: 'breakfast', name: 'Breakfast', note: 'Mornings, handled' },
  { id: 'main-meals', name: 'Main Meals', note: 'The full plate' },
  { id: 'rice-dishes', name: 'Rice Dishes', note: 'Jollof and its family' },
  { id: 'soups', name: 'Soups', note: 'Cooked long, seasoned properly' },
  { id: 'swallows', name: 'Swallows', note: 'Pounded, wrapped, warm' },
  { id: 'proteins', name: 'Proteins', note: 'By the piece or the portion' },
  { id: 'sides', name: 'Sides', note: 'The parts that finish a plate' },
  { id: 'small-chops', name: 'Small Chops', note: 'For sharing and standing' },
  { id: 'drinks', name: 'Drinks', note: 'Chilled, made in-house' },
  { id: 'specials', name: 'Specials', note: 'What we are cooking this week' },
]

export const products = [
  {
    slug: 'party-jollof-rice',
    name: 'Party Jollof Rice',
    category: 'rice-dishes',
    blurb: 'Smoky long-grain jollof, cooked down slowly in pepper and stock.',
    description:
      'Long-grain rice cooked over an open flame until the base catches and the smoke works its way through the pot. Served with fried plantain on the side.',
    portions: [
      { id: 'single', label: 'Single portion', price: 4500 },
      { id: 'sharing', label: 'Sharing (2–3)', price: 11000 },
      { id: 'tray', label: 'Small tray (8–10)', price: 38000 },
    ],
    options: [
      {
        id: 'protein',
        label: 'Add protein',
        choices: [
          { id: 'none', label: 'No protein', price: 0 },
          { id: 'chicken', label: 'Peppered chicken', price: 3500 },
          { id: 'beef', label: 'Beef', price: 3000 },
          { id: 'fish', label: 'Grilled fish', price: 5000 },
        ],
      },
    ],
    featured: true,
    signature: true,
    tone: 'gold',
  },
  {
    slug: 'egusi-and-pounded-yam',
    name: 'Egusi & Pounded Yam',
    category: 'soups',
    blurb: 'Melon seed soup with spinach and assorted meat, and a warm wrap of yam.',
    description:
      'Ground melon seed simmered with palm oil, spinach and assorted meat until thick. Comes with a fresh wrap of pounded yam.',
    portions: [
      { id: 'single', label: 'Single portion', price: 6500 },
      { id: 'sharing', label: 'Sharing (2–3)', price: 15000 },
    ],
    options: [
      {
        id: 'swallow',
        label: 'Choose your swallow',
        choices: [
          { id: 'pounded-yam', label: 'Pounded yam', price: 0 },
          { id: 'eba', label: 'Eba', price: 0 },
          { id: 'semo', label: 'Semo', price: 0 },
          { id: 'none', label: 'Soup only', price: -1000 },
        ],
      },
    ],
    featured: true,
    signature: true,
    tone: 'green',
  },
  {
    slug: 'peppered-chicken',
    name: 'Peppered Chicken',
    category: 'proteins',
    blurb: 'Grilled chicken tossed in a hot pepper sauce with onions.',
    description:
      'Chicken marinated overnight, grilled, then finished in a pepper and onion sauce made fresh each morning.',
    portions: [
      { id: 'quarter', label: '4 pieces', price: 5500 },
      { id: 'half', label: '8 pieces', price: 10000 },
    ],
    options: [
      {
        id: 'heat',
        label: 'Heat level',
        choices: [
          { id: 'mild', label: 'Mild', price: 0 },
          { id: 'medium', label: 'Medium', price: 0 },
          { id: 'hot', label: 'Hot', price: 0 },
        ],
      },
    ],
    featured: true,
    signature: false,
    tone: 'deep',
  },
  {
    slug: 'small-chops-platter',
    name: 'Small Chops Platter',
    category: 'small-chops',
    blurb: 'Puff puff, samosa, spring roll and peppered gizzard in one box.',
    description:
      'Our standing order for gatherings. Fried to order and packed warm, with pepper sauce on the side.',
    portions: [
      { id: 'box', label: 'Single box', price: 5000 },
      { id: 'party', label: 'Party pack (10 boxes)', price: 45000 },
    ],
    options: [],
    featured: true,
    signature: true,
    tone: 'gold',
  },
  {
    slug: 'ofada-rice-and-ayamase',
    name: 'Ofada Rice & Ayamase',
    category: 'rice-dishes',
    blurb: 'Local rice with green pepper stew, assorted meat and boiled egg.',
    description:
      'Unpolished ofada rice served with ayamase — bleached palm oil, green pepper and assorted meat, cooked slowly.',
    portions: [
      { id: 'single', label: 'Single portion', price: 6000 },
      { id: 'sharing', label: 'Sharing (2–3)', price: 14000 },
    ],
    options: [],
    featured: false,
    signature: true,
    tone: 'green',
  },
  {
    slug: 'akara-and-pap',
    name: 'Akara & Pap',
    category: 'breakfast',
    blurb: 'Bean cakes fried crisp, with smooth ogi.',
    description:
      'Beans peeled and ground the night before, fried in the morning. Served with pap and milk on the side.',
    portions: [{ id: 'single', label: 'Single portion', price: 3000 }],
    options: [],
    featured: false,
    signature: false,
    tone: 'cream',
  },
  {
    slug: 'yam-and-egg-sauce',
    name: 'Yam & Egg Sauce',
    category: 'breakfast',
    blurb: 'Boiled yam with a tomato and pepper egg sauce.',
    description: 'Soft boiled yam with egg sauce cooked in tomato, onion and fresh pepper.',
    portions: [{ id: 'single', label: 'Single portion', price: 3500 }],
    options: [],
    featured: false,
    signature: false,
    tone: 'gold',
  },
  {
    slug: 'fried-rice',
    name: 'Fried Rice',
    category: 'rice-dishes',
    blurb: 'Rice with vegetables, liver and a light curry seasoning.',
    description: 'Cooked in stock with mixed vegetables and liver, seasoned lightly so the rice stays the point.',
    portions: [
      { id: 'single', label: 'Single portion', price: 4500 },
      { id: 'sharing', label: 'Sharing (2–3)', price: 11000 },
    ],
    options: [],
    featured: false,
    signature: false,
    tone: 'green',
  },
  {
    slug: 'afang-soup',
    name: 'Afang Soup',
    category: 'soups',
    blurb: 'Afang leaf and waterleaf with assorted meat and periwinkle.',
    description: 'Cooked the long way, with periwinkle, dried fish and assorted meat.',
    portions: [{ id: 'single', label: 'Single portion', price: 7000 }],
    options: [],
    featured: false,
    signature: false,
    tone: 'deep',
  },
  {
    slug: 'pounded-yam',
    name: 'Pounded Yam',
    category: 'swallows',
    blurb: 'Fresh yam, pounded smooth and wrapped warm.',
    description: 'Wrapped to order. Order alongside any soup.',
    portions: [
      { id: 'one', label: '1 wrap', price: 1500 },
      { id: 'two', label: '2 wraps', price: 2800 },
    ],
    options: [],
    featured: false,
    signature: false,
    tone: 'cream',
  },
  {
    slug: 'fried-plantain',
    name: 'Fried Plantain',
    category: 'sides',
    blurb: 'Ripe plantain fried soft at the middle.',
    description: 'Cut thick and fried in clean oil. Good with everything on this menu.',
    portions: [{ id: 'side', label: 'Side portion', price: 1500 }],
    options: [],
    featured: false,
    signature: false,
    tone: 'gold',
  },
  {
    slug: 'moi-moi',
    name: 'Moi Moi',
    category: 'sides',
    blurb: 'Steamed bean pudding with egg and fish.',
    description: 'Ground beans steamed in leaves, with boiled egg and mackerel through it.',
    portions: [{ id: 'one', label: '1 wrap', price: 1800 }],
    options: [],
    featured: false,
    signature: false,
    tone: 'green',
  },
  {
    slug: 'chapman',
    name: 'Chapman',
    category: 'drinks',
    blurb: 'House chapman, mixed fresh and served cold.',
    description: 'Made in-house each morning. Sold by the bottle.',
    portions: [{ id: 'bottle', label: '50cl bottle', price: 2000 }],
    options: [],
    featured: false,
    signature: false,
    tone: 'deep',
  },
  {
    slug: 'zobo',
    name: 'Zobo',
    category: 'drinks',
    blurb: 'Hibiscus with ginger and pineapple, lightly sweetened.',
    description: 'Steeped overnight with ginger, cloves and pineapple.',
    portions: [{ id: 'bottle', label: '50cl bottle', price: 1500 }],
    options: [],
    featured: false,
    signature: false,
    tone: 'gold',
  },
  {
    slug: 'asun',
    name: 'Asun',
    category: 'proteins',
    blurb: 'Smoked goat meat in pepper and onion.',
    description: 'Goat meat smoked, then finished hot with pepper and onion.',
    portions: [{ id: 'portion', label: 'Single portion', price: 7500 }],
    options: [],
    featured: false,
    signature: false,
    tone: 'deep',
  },
  {
    slug: 'weekend-special',
    name: 'Weekend Special',
    category: 'specials',
    blurb: 'A rotating dish, announced on Instagram each Thursday.',
    description:
      'One dish, cooked in limited quantity for the weekend. Follow us to see what is on the fire.',
    portions: [{ id: 'single', label: 'Single portion', price: 6500 }],
    options: [],
    featured: false,
    signature: false,
    tone: 'cream',
  },
]

export const getProduct = (slug) => products.find((p) => p.slug === slug)
export const byCategory = (id) => products.filter((p) => p.category === id)
export const featured = () => products.filter((p) => p.featured)
export const signature = () => products.filter((p) => p.signature)
export const categoryName = (id) => categories.find((c) => c.id === id)?.name ?? id

export const naira = (amount) =>
  `₦${Number(amount).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`
