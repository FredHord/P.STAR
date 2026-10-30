# PAZL — website

A static site: plain HTML, one stylesheet, one small script, no build step. Upload the folder as-is to any static host.

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home: hero, eight selected projects, expertise, studio, client ticker, contact |
| `work.html` | Our work, filterable by discipline (`work.html#video` deep-links a filter) |
| `work/*.html` | One page per selected project (eleven so far) |
| `studio.html` | Founder, services, clients, press, contact form |
| `404.html` | Not-found page (Netlify and Vercel pick it up automatically) |
| `assets/css/style.css` | All styles. Colours and fonts are tokens at the top. |
| `assets/js/main.js` | Mobile menu, work filter, footer year, contact-form fallback |
| `assets/img/` | WebP images at 1500px wide, pulled from the current Squarespace site |

## Run it locally

```bash
python3 -m http.server 8787 --directory fsf-site
```

Then open http://localhost:8787. Any static server works; opening `index.html` directly from Finder also works.

## Host it

**Netlify (easiest).** Go to app.netlify.com/drop and drag the `fsf-site` folder onto the page. You get a live URL in seconds. Add your domain under Site settings → Domain management.

**Vercel.** `npx vercel` inside the folder, accept the defaults. Or import a GitHub repo at vercel.com/new.

**GitHub Pages.** Push the folder contents to a repo, then Settings → Pages → Deploy from branch (`main`, root).

**Cloudflare Pages, Render, S3, or any shared host.** Upload the folder contents to the web root. No server config needed.

### Pointing fsf-studio.com at the new site

In your domain registrar (or Squarespace Domains if the domain lives there), replace the Squarespace DNS records with the ones your new host gives you: usually an `A` record for the root and a `CNAME` for `www`. Keep the Squarespace site live until the new one resolves, then cancel the Squarespace plan.

## Before launch: things to fill in

Search the files for `TODO` and `[` to find every placeholder.

- **Contact form.** `studio.html` posts to Formspree. Create a free form at formspree.io, copy its endpoint and replace `YOUR_FORM_ID`. Until then, pressing Send opens an email draft to studio@fsf-studio.com instead.
- **Instagram.** Every footer has an Instagram link pointing at instagram.com. Replace with the studio's profile URL.
- **Client logos.** The ticker on the home page shows the 22 logos in `assets/img/clients/` (transparent PNGs cut from the logo sheet). To add one, drop a PNG in that folder and add a matching `<li>` to *both* lists inside `.ticker__track` in `index.html`, with `data-size` set to `wide`, `mid` or `tall` depending on the logo's shape. To remove one, delete its `<li>` from both lists.
- **Project years and photographers.** `[YEAR]` and `[PHOTOGRAPHER]` in the six project pages.
- **Press links.** The NYT and PAUSE links go to the publications' home pages. Swap in the article URLs.
- **Video links.** The Vimeo and YouTube links were matched to titles by their order on the current site. Click each one once to confirm it plays the right film.
- **Open Graph images.** The `og:image` tags assume the site lives at www.fsf-studio.com. Change the domain if it will live elsewhere.

## Adding a project page

1. Copy `work/godspeed.html` to `work/your-project.html`.
2. Change the title, meta, eyebrow, heading, the `meta` list, the text, the gallery images and the credits.
3. Fix the previous/next links at the bottom, and the neighbouring pages' links to it.
4. Link to it from its card in `work.html` and, if it is a selected project, from `index.html`.

Gallery blocks: a lone `<img>` is full width; wrap two in `<div class="gallery--two">` for a pair, three in `gallery--three`. A film is an `<a class="video">` tile linking to Vimeo or YouTube.

## Adding a card to Our work

The index lists one card per project folder in `PAZL WEBSITE` (24 at the moment), each with a cover from that folder; the old one-card-per-deliverable list is kept at `work-before-folders.html` in the project notes if anything needs restoring. Copy any `<article class="card" data-cat="…">` in `work.html`. `data-cat` must be one of `fashion`, `photo`, `video`, `art`, `wardrobe`, `collab`, `merch`. The numbering is recalculated by the script, so order does not matter. Update the static count in the `data-count` element if you care about the no-JavaScript case.

## Images

Everything in `assets/img/` is WebP at 1500px on the long side, which is enough for a 760px column on a 2× display. To add images, export as WebP (or JPEG) at 1500px and set `width` and `height` on the `<img>` so the page does not jump while loading. Use `loading="lazy"` on everything below the first screen.

## Looping films on the home page

Seven of the eight selected projects show a short looping film: the GIF from each project folder, converted to MP4 in `assets/video/` (1 to 2 MB each instead of 9 to 19 MB as GIF, and sharper). Each is a `<video muted loop playsinline preload="none">` with a poster JPEG; the script loads and plays it only while it is near the viewport, and pauses it when it scrolls away. With JavaScript off or reduced motion on, the poster shows.

- To swap a film, replace the `.mp4` and `.jpg` pair in `assets/video/` and update `data-src`, `poster`, `width` and `height` on the `<video>`.
- To convert another GIF, `gif2mp4.m` in the project notes is a small Objective-C tool using Apple's frameworks; any tool such as ffmpeg works too: `ffmpeg -i in.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" out.mp4`.
- J.I.D × Fear of God has no film, so it keeps the rolling image sequence below.

## Full-bleed project panels

Each selected project on the home page is a screen-height panel: the film (or the J.I.D sequence) covers it edge to edge, a dark gradient rises from the bottom, and the caption sits on top in white. This is the `project--cover` class on each `<article class="project">` in `index.html`; its rules are the last block in `style.css`. Remove the class to go back to the split layout (caption left, film right). The films were re-encoded at 1280 px wide from the 600 to 800 px GIF conversions using Lanczos scaling plus a light unsharp mask (`upscale.m` in the project notes, Apple frameworks only), which holds up far better than letting the browser stretch them. A fine animated film grain sits over each panel to hide what softness remains. Two panels (`project--top`) put the caption top-left for variety. Video URLs carry a `?v=` number; bump it whenever you replace a film so browsers fetch the new file. The Lanvin film is the exception to the upscaling: it was cut from a 3456×1800 screen recording of the original film (`encode.m` in the project notes: trims, caps the frame rate at 30, Lanczos-scales to 1600 wide and writes the MP4 plus poster), so it is the sharpest panel. The Yung Miami loop comes straight from the 4K master instead: `loopcard.m` holds the Watch Dis title card (`watchdisframeadjusted.png` in the project folder) for 1.8 s, then plays the first five seconds of the film at 1600×900. Sinsational (9 to 16 s of the spot, then the spray at 23 s and the roses wilting at 27 s, joined with `cut.m`), Birthday Bash (from the car pulling into the garage through the crowd to the stage, ending before the FREE DURK card), Cease & Desist (the jacket-and-cigarette stretch of Sunset Rodeo) and Godspeed (the bridge, the red car and the newspaper, 35.5 to 42.1 s of the film) are cut from their masters the same way. Gunna is eight short moments of the tour screen recording (crowd, pole dancers in the pyro, the spark-shower jump, the rock set, the flames) joined into one loop with `cut.m`, which takes any number of start/duration pairs. No loop is GIF-derived any more. For any other project with a master file or a screen recording, run it through `encode.m` (one stretch), `cut.m` (several stretches joined) or `loopcard.m` (title card plus loop) and replace the pair in `assets/video/`.

## Rolling image sequences

A `.roll` block is a stack of `<img>` frames in a 4:5 box that the script cycles like a GIF, only while the block is on screen. The first frame still shows if JavaScript is off or the visitor prefers reduced motion.

- To change the speed, set `data-interval` on the block (milliseconds per frame, default 1400).
- To add or reorder frames, add or move `<img>` tags inside the block. Keep the first frame the strongest one: it is the poster. Update the `1 / 6` counter text to match the frame count.
- Frames can be any aspect ratio; they are cropped to 4:5 from the centre.

## Header animation

On the home page the four puzzle pieces (`assets/img/pieces/*.png`, one transparent layer each, all 800×726 so they stack exactly) fly in from their corners and lock together, then the wordmark and tagline fade up. It is pure CSS: each piece carries its start offset and rotation as `--dx`, `--dy`, `--r` and its delay as `--d` in `index.html`; timing lives under "pieces assembling" in `style.css`. Visitors with reduced motion on see the mark already assembled. The other pages use the static mark with a small wordmark.

## Disciplines: colours and pieces

Four disciplines map to the four pieces of the mark and their colours: music (purple), fashion (white), tech (blue), art (orange). The colours are tokens at the top of `style.css` (`--c-music` and so on). On the home page, hovering the mark pulls the four pieces apart (each piece's hover offset is `--hx`, `--hy`, `--hr` on its `<img>`); the piece under the cursor comes out furthest and its discipline is named below. Clicking it scatters the pieces and scrolls to the first project tagged with that discipline. The script tests the cursor against each piece's transparency, read from the PNGs through a canvas; when the browser refuses that (for example with the page opened from Finder as a `file://` URL) it falls back to the four quadrants of the mark, so the hover still works. Each project `<article>` carries `data-disciplines="music fashion"` and shows matching chips under its caption; edit the attribute and the chips together to retag a project.

## All Work as a jigsaw (28 Oct)

- The knobs are the classic round head on a narrow neck (`edge()` in jigsaw.js, knob room `TAB = 0.34` of the cell). Each piece lifts out of a grey slot of its own shape (`.piece__depth`, colour `--slot`); a puzzle-texture background was tried and dropped.
- The page is a timeline (`ol.drops`); the assembled 6 × 4 block that used to close it was removed on 28 Oct: a dashed spine down the middle, each project's text on the left (number, discipline, year, title, description, View project), the piece on the right cut with its own tabs and a dark offset layer (`.piece__depth`) for thickness, and a rotated year marker on the spine wherever the year changes. Rows get `.is-placed` from an IntersectionObserver as they scroll in, which drops the piece onto the line; reduced-motion users see everything placed. Under 820 px the spine moves to the left edge and the piece sits above its text.

- `work.html` no longer has category pills or a card grid. The 24 thumbnails are cut into interlocking jigsaw pieces (`assets/js/jigsaw.js` builds one SVG `clipPath` per piece in `objectBoundingBox` units, with tab directions shared between neighbours from a fixed seed, so the cut is identical on every visit) and assembled into one block: 6 × 4 on desktop, 4 × 6 under 1000 px, 3 × 8 under 620 px. Each `a.piece` carries `data-num`, `data-cat`, `data-released`, `data-title`, `data-desc` (never `data-year`: main.js rewrites any `[data-year]` as the footer year).
- Hover or focus lifts a piece out of the puzzle (scale, lift, drop shadow on the outer element so the shadow isn't clipped) and shows its number, discipline, year, title and one-line description inside the piece. Click opens the `.expand` dialog with the full image, the same text and a View project button; Escape or the backdrop closes it. Links still work without JS.
- The canvas Work board (`Work.dc.html`) carries the same piece markup as a DC component: fixed 6 × 4, clip paths injected into one `<svg>` on the body in `componentDidMount`, expand handled through component state.

## All 27 projects have pages (28 Oct)

- `work/` holds one page per All Work card, 24 in all, in release order newest first; the pager on every page walks that order and `work.html` lists the cards the same way with the year in each eyebrow (`data-released`). Kodak Black and Atlanta Hawks × Michelob Ultra show "Year TBC" and sit last until a year is known.
- The thirteen pages added on 28 Oct were generated by `mkpages.py` (scratchpad) from the project folders: Heavy Is the Crown, Deep Thoughts, Needles Kimono, Beezy, Ghetto Gods, BAPE × Future, F.S.F × Newport, Made in Lagos, Freakshow, Double R, Furikaze, Kodak Black, Hawks × Michelob. Folder GIFs became loops (`needles-kimono`, `freakshow`, `ghetto-gods-1/2/3`, `newport`); YouTube and Vimeo films are embedded where that is the only copy.
- The canvas mirrors this: `mkboards.py` regenerates all 24 boards from the site pages (three rows of eight under the Home board) and the Work board's cards link to them.

## Collage format (diptychs)

- J.I.D × Fear of God, Lanvin, Godspeed, Sinsational, Yung Miami and Lil Durk / Birthday Bash galleries use full-width diptychs: two photos joined at the same height with a 12 px white gutter (`diptych out.jpg left right height gutter ffffff`, source in the parent folder), alternating with single images. Files are `assets/img/<project>-diptych-N.jpg`.
- Gunna shows every photo full width instead (admat first, then the loop, eleven photos, sketches last); live photos are Chris Polk for Billboard, credited on the page.
- Yung Miami: the CD mockups from `Album Art` sit in two diptychs (cover + alternate CD, CD front + back).
- Birthday Bash opens on `assets/video/lil-durk-stage.mp4`, a 14.7 s loop cut from the three house-camera recordings in `stage video` (twelve lighting states, ending on house lights): segments cut with `cut`, concatenated with `join out.mp4 in1 in2 …` (AVMutableComposition, source in the parent folder), then `encode` to 1600 wide at 3.5 Mbps.

## Films on the project pages

- Every project whose folder holds a video now plays it on its page. Only Future / Freebandz still embeds third-party players (Sinsational on Vimeo, Sticks Up on YouTube, `figure.embed` + iframe with a "watch on" link underneath). Cease & Desist, Godspeed and Sinsational have no Vimeo links by request. Each video must allow embedding in its Vimeo / YouTube settings.
- Films with no online copy are self-hosted as `assets/video/*-film.mp4` (H.264 + AAC, `controls`, `preload="none"`, poster JPEG), made with `film in out.mp4 poster.jpg width kbps posterSec` (source in the parent folder): Yung Miami `yung-miami-film` (Take Me to Chanel, 1280×720, 1:32, ~30 MB), Lil Durk `lil-durk-birthday-bash-film` (design & recap, 1280×960, 0:18), Cease & Desist `cease-and-desist-film` (Sunset Rodeo, 1280×938, 0:57, ~18 MB) and Godspeed `godspeed-film` (Supercar Run, 1280×720, 1:00, ~19 MB). The canvas carries 960-wide copies under 10 MB.
- The muted loops from the home page also open the Lanvin, Cease & Desist and Godspeed galleries, and the GIFs in the Future Freebandz and J.I.D × Kellogg's folders became `future-freebandz(-2)` and `jid-x-kelloggs` loops (`gif2mp4`).

## Cursor

A pixel-art pointing hand (`assets/img/cursor-hand.png`, with `cursor-hand@2x.png` for retina screens) is the cursor everywhere on the site, by choice; only the contact form's text fields keep the I-beam. The art is 16×16 drawn at 2 px per pixel, hotspot at the fingertip; `cursor.py` in the project notes redraws both files from a text grid, so editing the grid is enough to change the hand. The rule is under "cursor" in `style.css`: delete that block to go back to the browser's default arrow.

## Fonts

Syne (display), Syne Mono (labels) and Inter (reading) load from Google Fonts. To self-host instead, download them from fonts.google.com, put the files in `assets/fonts/`, add `@font-face` rules at the top of `style.css` and remove the `<link>` tags in each page's `<head>`.

## Hero mark and the registered sign (29 Oct, later)

- The home hero is two columns: on the left the eyebrow ("01 — PAZL®…") above the wireframe globe, on the right the headline and lede. `main.js` sizes the globe so eyebrow + gap + globe equals the copy's height (ResizeObserver on the copy and its children, re-run after `document.fonts.ready`).
- The four-piece mark (`assets/img/pieces/*.png`) sits at the centre of the globe. The old header hover code in `main.js` drives it: the piece under the cursor comes loose with a label, click sends you to `work.html#<piece>`. The four pieces map to groups of work categories: art → Art Direction + Photography, fashion → Fashion + Wardrobe, music → Video ("Film"), tech → Collaboration + Merchandise + Activation ("Brands"). `work.html` reads that hash and hides the other timeline rows; the count line shows "n of 27 projects · Group · Show all".
- Every visible "PAZL®" is `PAZL<span class="reg">®</span>` (a small raised ®); titles and attributes keep the plain character. `mkpages.py` applies this (`regmark`) after generating pages. Canvas boards carry the same span and a `.reg` rule in their `<style>`.
