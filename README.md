# P.STAR

Static site for the P.STAR fashion brand — stark industrial minimalism inspired by
a-cold-wall.com. Monochrome only: background `#0a0a0a`, foreground `#f1f3ef`.

## Structure

- `index.html` — nav, full-bleed video hero, lookbook grid, brand statement, footer
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
| Lookbook 01 | `assets/img/sprinter.jpg` | Sprinter |
| Lookbook 02 | `assets/img/boxer.jpg` | Boxer |
| Lookbook 03 | `assets/img/highjump.jpg` | High jumper |
| Lookbook 04 | `assets/img/kick.jpg` | Bicycle kick |

`assets/img/favicon.png` and `assets/img/logo-mark.png` are both derived from the
brand's P.STAR mark — one sized for the browser tab, the other for the nav bar
next to the wordmark.

## Fonts

The P.STAR wordmark and lookbook captions are styled for **Bookface** via
`--font-display` in `assets/css/style.css`. The actual font files aren't in this
repo yet — see `assets/fonts/README.md` for the exact filenames to drop in.
Until then it falls back to Helvetica Neue/Arial.

## Local preview

Serve the directory with any static file server, e.g. `python3 -m http.server`.
