# Bookface font files go here

The site's CSS (`assets/css/style.css`) already references Bookface for the
P.STAR wordmark and lookbook captions:

```css
@font-face {
  font-family: "Bookface";
  src: url("../fonts/Bookface-Bold.woff2") format("woff2"),
       url("../fonts/Bookface-Bold.otf") format("opentype");
  font-weight: 700;
  font-style: normal;
}
```

I couldn't license/download the actual Bookface font file myself, so drop the
files in here with these exact names and it'll pick them up automatically —
no further code changes needed:

- `Bookface-Bold.woff2` (preferred — smallest/fastest)
- `Bookface-Bold.otf` (fallback if you only have the desktop font)

Until then, the site falls back to Helvetica Neue/Arial, so nothing breaks —
it just won't show the real typeface yet.
