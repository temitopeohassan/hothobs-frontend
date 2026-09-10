# hothobs-frontend
Repo for the Hothobs Cuisine  website

## The hero

The home page opens on a full-viewport hero built from a fixed composition
rather than fluid layout: every length in `src/styles/hero.css` is
`calc(N * var(--u))`, where `--u` is one design pixel measured off a
1353 x 1163 reference. Change `--u` and the whole thing scales as a unit —
do not substitute raw `px` values into it.

Three features rotate: **CATERING**, **MEALS** and **SOUPS**, defined by
`heroFeatures` in `src/data/site.js`. Array order is what places them: the
first entry is the one the page opens on, the second fills the left slot and
the third the right. Exactly one is on screen — its photograph is the
backdrop and its name is the headline — and the other two sit in the left
and right slots, cropped by the screen edges. Clicking one
promotes it. The rotation is fully reversible.

**The photographs are licensed Unsplash stock standing in for Hothobs' own
kitchen.** Replace each feature's `photo` id with real Hothobs photography
before launch and rewrite its `alt` to describe the picture actually used.
Each id is used twice: a wide crop for the backdrop and a square crop for
the circular side slot.

Two things in there are load-bearing and easy to break:

- All three cut-outs live in **both** slots as sibling `<img>` tags, and
  switching only toggles a class. Reassigning `img.src` instead would leave
  the browser painting the old picture until the new file downloaded.
- The backdrop layers cross-fade, and the outgoing one is held underneath
  until the incoming one has arrived, so a photograph that is not yet
  decoded cannot open a bare gap mid-swap.

The entrance animation runs once and then removes itself. It is skipped
entirely for `prefers-reduced-motion`, and for a tab that was never in
front.

## Local development

```bash
npm install
cp .env.example .env    # VITE_API_URL points at the backend
npm run dev
```

The site needs the API in `../hothobs-backend` running for sign in, registration
and orders. See that repo's README.
