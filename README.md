# hothobs-frontend
Repo for the Hothobs Cuisine  website

## Hero photographs

The home page hero rotates through three panels, defined by `heroSlides` in
`src/data/site.js`. Two of them expect real photographs in `public/hero/`:

| File                 | Shows                    |
| -------------------- | ------------------------ |
| `catering-event.jpg` | A Hothobs catering event |
| `signature-dish.jpg` | A plated signature dish  |

Until a file exists, that slide shows a labelled placeholder tile so the page
still works — **do not launch on placeholders.**

- Roughly square crops, about 1000x950 or larger. The hero renders at a 21:20
  ratio with `object-fit: cover`, so much wider images get cropped top and
  bottom.
- JPEG at ~80% quality, ideally under 300KB. This is the first thing a visitor
  sees, so it should load fast.
- Update each slide's `alt` text in `src/data/site.js` to describe the
  photograph you actually used — they are marked TODO.

The third panel is the drawn cooking pot, which needs no asset.

## Local development

```bash
npm install
cp .env.example .env    # VITE_API_URL points at the backend
npm run dev
```

The site needs the API in `../hothobs-backend` running for sign in, registration
and orders. See that repo's README.
