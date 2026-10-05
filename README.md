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

**FSF markup** is what FSF adds to the production cost. A **Job settings**
strip sits directly above the Order Total with the job's rate (20%) and the
transportation & ancillary on/off tick, so neither needs a panel opened. The
Rates panel carries the same markup field; any line can set its own rate in
its override panel, since one order can carry styles on different terms, and
the rollup says "varies by line" when any does.

Its numbers are transcribed from `docs/FSF_Production_Pricing.xlsx` (Fred, 9/30 –
10/1/2026) into the `DEFAULT_FABRICS`, `DEFAULT_WASHES` and `STYLES` constants
at the top of the page's script — **that block is the single place to edit when
FSF requotes.** Every value is also editable in the browser at runtime, so a
price change can be tried out before it is committed back to the file.

Behaviour worth knowing:

- **Canvas** ($7.75/yd, 65" roll) and the **Tote Bag** are not in the
  workbook — they were quoted separately. The tote is 15 × 13¾ × 4 with a 13"
  handle drop; its yield of 0.5825 yd is a measured nest on the 65" roll
  (body 16 × 33.5 — four across the roll — two gussets 5 × 15.25, two
  handles cut 8 × 41 for a 2" strap folded in quarters; ½" seams, 1" top
  hem; 98.6% of the cloth used).
  Sewing $5.50, cutting $0.43.
- The **enzyme wash** is priced by weight — $1.75/lb in the Rates panel —
  rather than by garment group, so a style needs a weight to use it: the
  tote is 0.5 lb (given) and the hangtag 0.0065 lb (its one 17.5 sq in cut
  against the tote's 1,344.5 at 0.5 lb — about 154 to the pound). Both
  default to it; it is one option in the line's wash dropdown, alongside the
  group washes, and a style with no weight is flagged rather than washed for
  nothing.
- The **Canvas Hangtag** shares the canvas price and the $0.50 cutting, and
  takes one **grommet** — hardware priced by the piece at $59.50 per 1,000
  (a rate in the Rates panel, a count per line). Packaging and grinding start
  off for it, since a garment's bag-and-tag and distressing do not belong on
  a tag. Its yield is 0.008929 yd: the 65" roll is cut into
  16×20 print sheets — a row of 4 upright over a row of 3 turned fills the
  full 36" yard, 7 sheets — each sheet yields 4×4 = 16 cuts of
  3.6218"×4.8306", and one cut is a tag: 16 tags a sheet, 112 a yard, 83.7%
  of the cloth used. Cutting $0.12. Printing is per project, so it goes under
  Embellishments; sewing is still unquoted and sits at $0.

A line with a fabric but no yield is excluded from the total and flagged,
the same way a fabric with no price is.
- **Fabric on hand** is a per-line tick for cloth already owned: the fabric
  cost drops to $0 while the yield stays counted, so the sheet still says how
  much of the leftover a run uses, and the invoice and report note "fabric
  supplied". It is a job setting, not a style one — a new line charges fabric
  unless ticked. The current tote and hangtag lines are ticked on load.
- **Distress grinding is charged on every style** at one rate, set in the
  Rates panel ($2.50/unit). Fred quoted that for hoodies and bottoms; the
  same rate is carried across tees, tank and track pieces — confirm it with
  him, since grinding a tee may not cost what grinding a hoodie does. It is
  on by default and toggles off per line.
- Unit costs match the spreadsheet's own computed totals to the cent for all 17
  style/wash builds it contains, once grinding is set to the state the
  workbook represents (it includes grinding for hoodies and bottoms, not for
  tees, tank or track). Tees, tank and track therefore quote $2.50 above the
  workbook by default.
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
panel; the on/off tick is in the Job settings strip above the Order Total —
off keeps the rate and drops the line) covers freight, ancillary development and the unexpected. It is a
cost of yours, so it lands on the cost sheet — applied to the whole order
after FSF's markup and one-time fees — and never on the invoice. The rollup
therefore separates **Payable to FSF** from **Total order cost**.

### Photos

Each line takes one photo. It is downscaled in the browser to 640px on its
longest edge and re-encoded as JPEG before being stored, because the whole
sheet lives in `localStorage` and a photo straight off a phone would spend
that budget on its own. Photos appear on the line card, the retail report and the
invoice. On the invoice the column shows only when at least one line has a
photo, so an invoice without them is laid out exactly as before; a
"Show photos" tick in Invoice details turns it off entirely.

### Retail report

Section 5 turns the order into a merchandising view — **Qty, COG per unit,
Sugg retail, Margin, Profit** — with the photos and a totals block. Profit is
the line's total, with the per-unit figure beneath it, so the column sums to
the Gross profit headline.

The figure columns have fixed widths and the style column takes what is
left, so numbers never get squeezed into each other; the report page is
wider than the invoice because it is a data table, and on a narrow screen
the table scrolls inside its own box.

**Landed cost** is FSF's price including their markup, plus that style's
share of its pattern, grading and embellishment setup (split across its
lines by unit count), plus the transportation & ancillary charge — so it is
the real cost per unit, not the garment cost.

**Suggested retail** is the cost sheet's selling price rounded to the
nearest $5 (configurable in the Rates panel; 0 disables rounding). Any line
can override it with a hand-set price, and the report marks those.

Profit figures assume full sell-through at those prices, and the report says
how many units cover the cost of the run.

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

The issue date **follows today's date** by default, so an invoice generated
next month is dated next month rather than the day the sheet was first
saved. Unticking "Always today" pins the field so a specific date can be
set; the invoice number and the due date both follow whichever applies.

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
