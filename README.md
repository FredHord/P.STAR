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
- Embellishments (printing, embroidery, studding) are **quoted per project** —
  the rates move every run, so there are deliberately no defaults for them in
  `STYLES` or anywhere else. Each build prices its own, and a line left at $0
  is flagged so it can't be quoted by accident.
- Packaging is FSF's flat $3.50/unit and **covers bagging and tagging**
  (confirmed with Fred). The separate "Finishing / other" toggle is a spare
  line for anything beyond that; it is off and unpriced by default.
- The order is saved to `localStorage`, and exports as print/PDF or CSV.

Nothing links to it from the public site — like `checklist.html` it is reached
by URL, since it exposes cost prices.

It opens on two worked example builds so the sheet is legible at a glance;
"Clear examples" empties it. The order is then remembered per browser.

A **transportation & ancillary** charge (5% by default, set in the Rates
panel) covers freight, ancillary development and the unexpected. It is a
cost of yours, so it lands on the cost sheet — applied to the whole order
after FSF's markup and one-time fees — and never on the invoice. The rollup
therefore separates **Payable to FSF** from **Total order cost**.

### Invoicing

Section 4 turns the order into a clean invoice — line items, one-time
charges, optional shipping, tax and deposit, with a totals block and payment
notes. It shows only what the payer is owed; the cost breakdown behind it
never appears on the document. Two directions:

- **FSF billing you** (the default) charges each unit at cost including
  FSF's markup, and bills pattern, grading and embellishment setup once per
  style.
- **You billing a customer** charges the selling price instead; one-time
  fees are then optional.

When "Paid by" is set to credit card, the invoice adds a **card processing
fee** (3%, editable) on the subtotal; set it to 0 to drop the line. The
invoice charges no sales tax — add it as a line item if an order ever needs
it.

Payment terms default to **50% deposit on order, balance before production
completion**, with the due date equal to the issue date (due on receipt, no
net terms). Both are editable per invoice; a saved invoice from before this
default is migrated on load, keeping its order intact.

The invoice renders on a light paper surface in either theme, because it is
a document and it is what gets printed. If any price is still open on the
cost sheet, a banner says so on screen — it does not print.

### Running it off a desktop, without the repo

`costing.html` is one self-contained file with no build step and no server.
Download it anywhere and double-click it; everything works offline except
the webfonts, which fall back cleanly. Use this copy rather than the
published Artifact when you need a real PDF: a browser opening a local file
can Print → Save as PDF, which the Artifact frame does not allow.

### The published Artifact copy

`tools/build-artifact.py` generates the Claude Artifact version:

    python3 tools/build-artifact.py > build/artifact.html

A published Artifact runs in a locked-down frame where this page's document
skeleton is supplied by the host, `print()` and `confirm()` do nothing, and
script-driven downloads are inert. The script applies exactly those
adaptations — dropping the Print buttons, turning the CSV export into a
clipboard copy, and replacing the two confirm dialogs with a tap-again arm on
the button — so the repo page keeps working as a normal web page and the two
copies never drift by hand. Every substitution asserts it matched exactly
once, so editing `costing.html` in a way that invalidates one fails the build
loudly instead of shipping a broken page. `build/` is not committed.

## Local preview

Serve the directory with any static file server, e.g. `python3 -m http.server`.
