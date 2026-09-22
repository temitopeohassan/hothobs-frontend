/**
 * ─────────────────────────────────────────────────────────────
 *  CATERING MENU — transcribed from "2026 Hothobs party menu-1.pdf"
 * ─────────────────────────────────────────────────────────────
 *  Unlike src/data/menu.js this is not placeholder copy: every
 *  dish, option and price below is taken from the 2026 catering menu
 *  Hothobs supplied. Re-check it against the PDF whenever a new
 *  edition is issued.
 *
 *  Nothing here is orderable online. Catering is quoted and
 *  confirmed by the kitchen — see CateringMenu.jsx — so these
 *  prices are per head and indicative, before service charge,
 *  VAT and transport.
 *
 *  Course shape:
 *    id         unique, used in the url hash and the enquiry text
 *    name       display name
 *    blurb      one line under the heading
 *    tiers      [{ id, label, min, price }] per-head price by headcount
 *    groups     [{ id, name, note, choices }] what the customer picks
 *    choices    [{ id, name, price?, items?: [] }]
 *
 *  A choice carrying its own `price` (the Chinese courses) is a
 *  flat per-head rate and ignores the course tiers.
 */

/** Headcount bands used by the canapé and mini-bowl courses. */
const smallTiers = [
  { id: '20-40', label: '20 – 40 guests', min: 20 },
  { id: '50-90', label: '50 – 90 guests', min: 50 },
  { id: '100+', label: '100 guests and above', min: 100 },
]

/** Headcount bands used by every main course. */
const mainTiers = [
  { id: '1-20', label: '1 – 20 guests', min: 1 },
  { id: '30-50', label: '30 – 50 guests', min: 30 },
  { id: '60-80', label: '60 – 80 guests', min: 60 },
  { id: '90+', label: '90 guests and above', min: 90 },
]

const priced = (tiers, prices) => tiers.map((t, i) => ({ ...t, price: prices[i] }))

export const courses = [
  {
    id: 'canapes',
    name: 'Canapés',
    blurb: 'Passed around while everyone arrives. Pick one of the four selections.',
    tiers: priced(smallTiers, [9000, 8000, 7000]),
    groups: [
      {
        id: 'selection',
        name: 'Choose one selection',
        pick: 'one',
        choices: [
          {
            id: 'option-1',
            name: 'Option 1',
            items: [
              'Spicy Chicken Lollipop',
              'Fish in Batter',
              'Mini Chicken Burgers',
              'Beef Kebabs',
            ],
          },
          {
            id: 'option-2',
            name: 'Option 2',
            items: [
              'Chicken Kebabs',
              'Spicy Gizdodo',
              'Spicy Glazed Chicken Wings',
              'Battered Shrimp Cocktails',
            ],
          },
          {
            id: 'option-3',
            name: 'Option 3',
            items: [
              'Spicy Meatballs',
              'Spicy Gizdodo',
              'Crispy Chicken Lollipop',
              'Spicy Fish Fillets',
            ],
          },
          {
            id: 'option-4',
            name: 'Option 4',
            items: [
              'Seafood Kebabs (Shrimp, Fish)',
              'Crispy Chicken Lollipop',
              'Spicy Korean Meatballs',
              'Smoked Chicken Salad',
              'Beef Kebabs',
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'mini-bowl-rice',
    name: 'Mini bowl — rice',
    blurb: 'Small bowls, served standing.',
    tiers: priced(smallTiers, [4500, 4000, 3500]),
    groups: [
      {
        id: 'bowl',
        name: 'Choose one bowl',
        pick: 'one',
        choices: [
          { id: 'asun-jollof', name: 'Asun Jollof Rice with Plantain' },
          {
            id: 'jambalaya',
            name: 'Jambalaya Jollof Rice served with Chicken Kebabs & Plantain',
          },
          {
            id: 'seafood-coconut',
            name: 'Seafood Coconut Rice served with Fish Fillets & Plantain',
          },
          {
            id: 'beefy-cinnamon',
            name: 'Beefy Cinnamon Rice served with Beef Kebabs & Plantain',
          },
          { id: 'ofada', name: 'Ofada Rice served with Peppered Beef & Plantain' },
        ],
      },
    ],
  },

  {
    id: 'mini-bowl-pasta',
    name: 'Mini bowl — pasta',
    blurb: 'Small bowls, served standing.',
    tiers: priced(smallTiers, [9000, 8000, 7000]),
    groups: [
      {
        id: 'bowl',
        name: 'Choose one bowl',
        pick: 'one',
        choices: [
          { id: 'creamy-seafood', name: 'Creamy Seafood Pasta with Shrimps' },
          { id: 'creamy-chicken', name: 'Creamy Chicken Pasta with Chicken Breast' },
          { id: 'tomato-seafood', name: 'Tomato Seafood Pasta with Shrimps' },
          { id: 'tomato-chicken', name: 'Tomato Chicken Pasta with Chicken Bites' },
          { id: 'singapore', name: 'Stir-fry Singapore Noodles with Chicken Kebabs' },
          { id: 'bolognese', name: 'Spaghetti Bolognese with Spicy Meatballs' },
        ],
      },
    ],
  },

  {
    id: 'mini-bowl-potatoes',
    name: 'Mini bowl — potatoes',
    blurb: 'Small bowls, served standing.',
    tiers: priced(smallTiers, [7000, 6000, 5000]),
    groups: [
      {
        id: 'bowl',
        name: 'Choose one bowl',
        pick: 'one',
        choices: [
          {
            id: 'lamb-cutlets',
            name: 'Lamb Cutlets in Gravy served with Mashed Potatoes / Irish Potatoes & Sweetcorn',
          },
          {
            id: 'creamy-chicken-bites',
            name: 'Creamy Chicken Bites served with Mashed Potatoes / Irish Potatoes / Sweetcorn',
          },
        ],
      },
    ],
  },

  {
    id: 'soups-and-salad',
    name: 'Soups & salad',
    blurb: 'All served with bread rolls and butter.',
    tiers: priced(mainTiers, [7000, 6000, 5000, 4000]),
    groups: [
      {
        id: 'salad',
        name: 'Salad',
        pick: 'one',
        choices: [
          { id: 'asian-beef', name: 'Asian Beef Salad' },
          { id: 'grilled-chicken', name: 'Grilled Chicken Salad' },
          { id: 'shrimp-cocktail', name: 'Shrimp Cocktail' },
          { id: 'caesar', name: 'Chicken Caesar Salad' },
        ],
      },
      {
        id: 'nigerian-soup',
        name: 'Nigerian soups',
        pick: 'one',
        choices: [
          { id: 'chicken-pepper', name: 'Chicken Pepper Soup' },
          { id: 'beef-goat-pepper', name: 'Beef / Goat Meat Pepper Soup' },
          { id: 'fish-pepper', name: 'Fish Pepper Soup' },
          { id: 'oxtail-pepper', name: 'Oxtail Pepper Soup' },
        ],
      },
      {
        id: 'continental-soup',
        name: 'Continental soups',
        pick: 'one',
        choices: [
          { id: 'cream-of-chicken', name: 'Cream of Chicken Soup' },
          { id: 'chicken-corn', name: 'Asian Chicken & Corn Soup' },
          {
            id: 'pho',
            name: 'Pho Soup — noodles and protein in a special broth with vegetables',
          },
          {
            id: 'seafood-chowder',
            name: 'Seafood Chowder (Fish, Calamari, Shrimps) in a creamy soup',
          },
          {
            id: 'seafood-bisque',
            name: 'Seafood Bisque (Fish, Calamari & Shrimps) in a clear soup',
          },
        ],
      },
    ],
  },

  {
    id: 'nigeria',
    name: 'Nigeria menu',
    blurb: 'The full Nigerian spread. Pick the option that suits your table.',
    tiers: priced(mainTiers, [11000, 10000, 9500, 9000]),
    groups: [
      {
        id: 'option',
        name: 'Choose one option',
        pick: 'one',
        choices: [
          {
            id: 'option-1',
            name: 'Option 1',
            items: [
              'Jollof Rice & Fried Rice served with any 2 proteins (Stewed Chicken, Stewed Fish, Stewed Meat) & Plantain / Moinmoin / Salad',
              'Asaro served with Pepper Sauce (Ofada Sauce) with any 2 proteins (Stewed Chicken, Stewed Beef, Stewed Fish) & Plantain',
              'Ofada Rice & Sauce served with any 1 protein (Stewed Fish or Stewed Chicken), Plantain & Moinmoin',
              'Poundo or Semovita served with any 1 soup option (Efo riro, Efo-Egusi, Edikaikan, Ila alasepo, Afang) and any 2 proteins (Stewed Chicken, Stewed Fish, Stewed Beef)',
            ],
          },
          {
            id: 'option-2',
            name: 'Option 2',
            items: [
              'Jollof Rice & Fried Rice served with any 2 proteins (Stewed Chicken, Stewed Fish, Stewed Beef) & Plantain / Moinmoin / Salad',
              'Asaro served with Ofada Sauce with any 2 proteins (Stewed Chicken, Stewed Beef, Stewed Fish) & Plantain',
              'Poundo or Semovita served with any 1 soup option (Efo riro, Efo-Egusi, Edikaikan, Ila alasepo, Afang) and any 2 proteins (Stewed Chicken, Stewed Fish, Stewed Beef)',
            ],
          },
          {
            id: 'option-3',
            name: 'Option 3',
            items: [
              'Jollof Rice & Fried Rice served with any 2 proteins (Stewed Chicken, Stewed Meat, Stewed Fish) & Plantain / Moinmoin / Salad',
              'Ofada Rice & Sauce served with any 1 protein (Stewed Fish or Stewed Chicken) & Plantain / Moinmoin',
              'Poundo or Semovita served with any 1 soup option (Efo riro, Efo-Egusi, Edikaikan, Ila alasepo, Afang) & any 2 proteins (Stewed Chicken, Stewed Fish, Stewed Beef)',
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'nigeria-deluxe',
    name: 'Nigeria deluxe menu',
    blurb: 'A longer Nigerian spread, with village rice, agoyin beans and snails on the table.',
    tiers: priced(mainTiers, [12000, 11000, 10500, 10000]),
    extras: ['Peppered Snails', 'Peppered Grilled Turkey'],
    extrasNote: 'Extras at an additional cost per item.',
    groups: [
      {
        id: 'option',
        name: 'Choose one option',
        pick: 'one',
        choices: [
          {
            id: 'option-1',
            name: 'Option 1',
            items: [
              'Jollof Rice & Fried Rice served with any 2 (Stewed Chicken, Stewed Fish, Stewed Beef) & Moinmoin / Salad / Plantain',
              'Asaro served with Pepper Sauce and any 2 proteins (Stewed Chicken, Stewed Fish, Stewed Beef) & Plantain',
              'Ofada Rice & Sauce served with any 1 protein (Stewed Chicken, Stewed Fish, Stewed Beef) & Plantain & Moinmoin',
              'Village Rice (Dried Shrimps, Ponmo, Diced Beef, Ugwu, Oziza, Panla) served with any 1 protein (Stewed Chicken or Stewed Fish) & Plantain / Moinmoin',
              'Poundo or Semovita served with any 1 soup option (Efo Egusi, Efo riro, Edikaikan, Oha Soup, Afang Soup)',
              'Agoyin Beans and Sauce served with Plantain and 2 proteins (Stewed Chicken, Stewed Fish, Stewed Beef)',
            ],
          },
          {
            id: 'option-2',
            name: 'Option 2',
            items: [
              'Jollof Rice & Fried Rice served with any 2 proteins (Stewed Chicken, Stewed Fish, Stewed Beef) & Plantain & Moinmoin',
              'Steamed White Rice served with Spicy Snails, Stewed Fish in Spicy Stew, Fried Plantain and Steamed Vegetables',
              'Spicy Seafood Coconut Rice served with Stewed Fish, Grilled Turkey Wings in Pepper Sauce, Fried Plantain & Crunchy Salad',
              'Asaro (Yam Pottage) served with Spicy Meat Chunks (Ofada Sauce), any 2 proteins (Stewed Chicken, Stewed Fish, Stewed Beef) & Plantain',
              'Poundo or Semovita served with any 1 soup option (Efo Egusi, Efo riro, Ila alasepo, Edikaikan, Oha Soup, Afang Soup) & 2 proteins',
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'nigeria-chinese',
    name: 'Nigeria & Chinese menu',
    blurb: 'Both tables at once — the Nigerian spread alongside the oriental one.',
    tiers: priced(mainTiers, [12000, 11000, 10500, 10000]),
    groups: [
      {
        id: 'option',
        name: 'Both sides are served',
        pick: 'one',
        choices: [
          {
            id: 'nigeria-and-oriental',
            name: 'Nigeria & oriental',
            items: [
              'Nigeria — Jollof Rice & Fried Rice',
              'Nigeria — Asaro and Sauce',
              'Nigeria — Village Rice / Ofada Rice / Coconut Rice (any 1)',
              'Nigeria — Poundo or Semo served with any 1 soup option (Efo Riro, Okro Soup, Efo Egusi, Edikaikan) & any 2 proteins',
              'Nigeria — Salad / Plantain / Moinmoin',
              'Oriental — Chinese Rice',
              'Oriental — Singapore Noodles',
              'Oriental — Shredded Beef in Black Pepper Sauce',
              'Oriental — Diced Chicken Breast in Thai Curry Sauce',
              'Oriental — Grilled Prawns or Battered Fish',
              'Oriental — Sautéed seasonal mixed vegetables',
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'chinese',
    name: 'Chinese menu',
    blurb: 'Four oriental spreads, each at a flat rate per head.',
    // Each option is its own flat per-head price, so there are no tiers here.
    tiers: null,
    groups: [
      {
        id: 'option',
        name: 'Choose one option',
        pick: 'one',
        choices: [
          {
            id: 'option-1',
            name: 'Option 1',
            price: 12000,
            items: [
              'Chinese Rice',
              'Singaporean Noodles',
              'Mixed Veggies',
              'Shredded Beef in Black Pepper Sauce',
              'Diced Chicken in Green Thai Curry Sauce',
              'Grilled Prawns in Chilli Sauce',
              'Battered Fish Fillet',
            ],
          },
          {
            id: 'option-2',
            name: 'Option 2',
            price: 10000,
            items: [
              'Chinese Rice',
              'Singaporean Noodles',
              'Mixed Veggies',
              'Shredded Beef in Black Pepper Sauce',
              'Diced Chicken in Green Thai Curry Sauce',
              'Grilled Prawns in Chilli Sauce',
            ],
          },
          {
            id: 'option-3',
            name: 'Option 3',
            price: 9000,
            items: [
              'Chinese Rice',
              'Singaporean Noodles',
              'Mixed Veggies',
              'Shredded Beef in Black Pepper Sauce',
              'Diced Chicken in Green Thai Curry Sauce',
              'Battered Fish Fillet',
            ],
          },
          {
            id: 'option-4',
            name: 'Option 4 — one sauce option',
            price: 8000,
            items: [
              'Chinese Rice',
              'Singaporean Noodles',
              'Mixed Veggies',
              'One of: Shredded Beef in Black Pepper Sauce, Battered Fish Fillet, or Diced Chicken in Green Thai Curry Sauce',
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'continental',
    name: 'Continental menu',
    blurb: 'Plated continental courses — steaks, salmon, prawns and pasta.',
    tiers: priced(mainTiers, [18000, 17000, 16000, 15000]),
    groups: [
      {
        id: 'option',
        name: 'Choose one option',
        pick: 'one',
        choices: [
          {
            id: 'option-1',
            name: 'Option 1',
            items: [
              'Braised Fillet Mignon Steak on a bed of kale served with Beefy Cinnamon Rice and Mignon Jus',
              'Grilled Garlic Butter Prawns served with Potato Wedges, Seafood Bisque and Steamed Veggies',
              'Grilled Lemon Butter Salmon sitting on a creamy mash and a side of Sautéed Vegetables',
              'Grilled Chicken Breast served with Penne Pasta tossed in a rich Arrabbiata (tomato) sauce and a side of Garlic Bread',
            ],
          },
          {
            id: 'option-2',
            name: 'Option 2',
            items: [
              'Grilled Fish Steak served with Parsley Rice, Coconut Curry and Green Salad',
              'Grilled Italian Herbed Chicken Lollipop served with Spicy Thai Rice, Chilli Sauce & Cole Slaw',
              'Chilli Prawns served with Spicy Seafood Coconut Rice and Garden Salad',
              'Slow-cooked Lamb Chops Steak served with Mashed Potatoes and Seasonal Sautéed Veggies',
            ],
          },
          {
            id: 'option-3',
            name: 'Option 3',
            items: [
              'Lamb Steaks, Grilled Prawns and Mashed Potato served with Rosemary, Mushroom Gravy and Glazed Carrot Batons',
              'Grilled Red Snapper Fillet served with Spicy Seafood Rice and Plantain Batons',
              'Spicy Chicken Roulade served with Potato Gratin, Penne Pasta tossed in seasonal veggies and Creamy Mushroom Sauce',
              'Grilled Tiger Prawns served with Penne Pasta tossed in Creamy Seafood Sauce & Garlic Bread',
            ],
          },
          {
            id: 'option-4',
            name: 'Option 4',
            items: [
              'Slow-cooked Lamb Bites in a creamy gravy served on a bed of Creamy Sweet Potato Mash and a side of Seasonal Veggies',
              'Asun Goat Meat served with Herby Chevon Jollof and a side of Plantain Batons',
              'Grilled Salmon served with Parsley Potatoes and a side of Green Crunchy Salad',
              'Grilled Prawns served with Linguine Pasta in a rich Creamy Seafood Sauce served with Garlic Bread',
            ],
          },
        ],
      },
    ],
  },
]

/** What every catering booking includes, at no extra cost. */
export const servicesIncluded = [
  'Waiters',
  'Plates',
  'Water glasses',
  'Wine glasses',
  'Champagne glasses',
  'Chafing dishes',
  'Menu card',
]

/** Everything a quote adds on top of the per-head price. */
export const additionalFees = [
  {
    title: 'Charger plates',
    body: 'Charger plates are not part of our complimentary services and attract an additional rental fee.',
  },
  {
    title: 'Transport',
    body: 'Lagos Island ₦60,000 – ₦100,000. Lagos Mainland ₦40,000 – ₦60,000. Lagos outskirts ₦100,000 – ₦150,000.',
  },
  {
    title: 'Service charge',
    body: 'Menu prices vary. Service charge is 10% – 20% of the total cost, and VAT is 7.5%.',
  },
  {
    title: 'Confirming your booking',
    body: '80% payment confirms your order. We invoice you directly — catering is not paid for through the online checkout.',
  },
]

/** The tier that applies to a headcount: the highest band it reaches. */
export const tierFor = (tiers, guests) => {
  if (!tiers?.length || !guests) return null
  const reached = tiers.filter((t) => guests >= t.min)
  return reached.length ? reached[reached.length - 1] : null
}

/** The smallest headcount a course can be quoted for. */
export const minGuests = (course) => course.tiers?.[0]?.min ?? 1

export const getCourse = (id) => courses.find((c) => c.id === id)
