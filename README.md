# P.STAR

Static site for the P.STAR fashion brand — stark industrial minimalism inspired by
a-cold-wall.com. Monochrome only: background `#0a0a0a`, foreground `#f1f3ef`.

## Structure

- `index.html` — nav, full-bleed video hero, lookbook grid, brand statement, footer
- `costing.html` — internal FSF production cost-sheet builder (see below)
- `checklist.html` — internal launch-readiness checklist
- `assets/css/style.css` — layout and theme
- `assets/js/main.js` — scroll-triggered reveals, nav state, and hero video motion handling (respects `prefers-reduced-motion`)
- `assets/img/` — imagery and hero video
- `assets/fonts/` — Bookface font files go here (see that folder's README)
- `.github/workflows/pages.yml` — builds and deploys to GitHub Pages on every push to `main`

## Imagery

Real photography/video, uploaded via the repo and resized/compressed for the web:

| Slot | File | Subject |
| --- | --- | --- |
| Hero | `assets/img/hero.mp4` (poster: `assets/img/hero.jpg`) | Long-exposure motion-blur sprint/leap, looping video |
| Lookbook 01 | `assets/img/runner.jpg` | Textured runner portrait |
| Lookbook 02 | `assets/img/sprinter.jpg` | Sprinter |
| Lookbook 03 | `assets/img/boxer.jpg` | Boxer |
| Lookbook 04 | `assets/img/kick.jpg` | Bicycle kick |

`assets/img/highjump.jpg` is currently unused (displaced when the grid was
reordered) but kept in the repo in case it rotates back in.

`assets/img/favicon.png` and `assets/img/logo-mark.png` are both derived from the
brand's P.STAR mark — one sized for the browser tab, the other for the nav bar
next to the wordmark.

## Fonts

The P.STAR wordmark and lookbook captions are styled for **Bookface** via
`--font-display` in `assets/css/style.css`. The actual font files aren't in this
repo yet — see `assets/fonts/README.md` for the exact filenames to drop in.
Until then it falls back to Helvetica Neue/Arial.

## FSF production costing

`costing.html` is a standalone, self-contained internal tool (no build step, no
dependencies) that turns FSF's pricing into a quote. Pick styles, set the wash,
grinding, embellishments and quantity per line, and it produces a full cost
sheet: per-unit breakdown, FSF markup, selling price, one-time fees and the
order total.

Its numbers are transcribed from `docs/FSF_Production_Pricing.xlsx` (Fred, 9/30 –
10/1/2026) into the `DEFAULT_FABRICS`, `DEFAULT_WASHES` and `STYLES` constants
at the top of the page's script — **that block is the single place to edit when
FSF requotes.** Every value is also editable in the browser at runtime, so a
price change can be tried out before it is committed back to the file.

Behaviour worth knowing:

- Unit costs match the spreadsheet's own computed totals to the cent for all 17
  style/wash builds it contains.
- A fabric with no price (Nylon, as of this writing) is **excluded** from the
  total and flagged, rather than counted as zero — same as the spreadsheet.
- Pattern and grading fees are charged **once per style**, so two lines of the
  same style are not billed twice.
- Embellishments (printing, embroidery, studding) are *not* in FSF's quote;
  their rates start empty and are flagged until filled in.
- The order is saved to `localStorage`, and exports as print/PDF or CSV.

Nothing links to it from the public site — like `checklist.html` it is reached
by URL, since it exposes cost prices.

## Local preview

Serve the directory with any static file server, e.g. `python3 -m http.server`.
