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

`assets/img/placeholder-*.svg` are procedurally generated monochrome motion-blur
placeholders standing in for the brand's real photography, which this build
could not fetch: the source hosts (`dropbox.com`, `*.cloudfront.net`) were
blocked by this session's outbound network policy.

To swap in the real photos, replace the referenced files (or update the `src`
attributes in `index.html`) with:

| Slot | Placeholder file | Intended image |
| --- | --- | --- |
| Hero | `assets/img/placeholder-hero.svg` | Long-exposure jumping athlete ("JUMPING") |
| Lookbook 01 | `assets/img/placeholder-sprinter.svg` | Sprinter |
| Lookbook 02 | `assets/img/placeholder-boxer.svg` | Boxer |
| Lookbook 03 | `assets/img/placeholder-highjump.svg` | High jumper |
| Lookbook 04 | `assets/img/placeholder-kick.svg` | Bicycle kick |

## Local preview

Serve the directory with any static file server, e.g. `python3 -m http.server`.
