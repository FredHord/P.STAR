# P.STAR

Static site for the P.STAR fashion brand — stark industrial minimalism inspired by
a-cold-wall.com. Monochrome only: background `#101010`, foreground `#f1f3ef`.

## Structure

- `index.html` — nav, full-bleed hero, lookbook grid, brand statement, footer
- `assets/css/style.css` — layout and theme
- `assets/js/main.js` — scroll-triggered reveals and nav state (respects `prefers-reduced-motion`)
- `assets/img/` — imagery
- `.github/workflows/pages.yml` — builds and deploys to GitHub Pages on every push to `main`

## Imagery

Real photography, uploaded via the repo and resized/compressed for the web:

| Slot | File | Subject |
| --- | --- | --- |
| Hero | `assets/img/hero.jpg` | Arched long-exposure motion-blur figure |
| Lookbook 01 | `assets/img/sprinter.jpg` | Sprinter |
| Lookbook 02 | `assets/img/boxer.jpg` | Boxer |
| Lookbook 03 | `assets/img/highjump.jpg` | High jumper |
| Lookbook 04 | `assets/img/kick.jpg` | Bicycle kick |

`assets/img/favicon.png` is a resized crop of the brand's P★ mark, used as the site favicon.

## Local preview

Serve the directory with any static file server, e.g. `python3 -m http.server`.
