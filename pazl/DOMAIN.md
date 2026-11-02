# pazlstudio.co on Netlify

## 1. Deploy (you)

1. https://app.netlify.com → Sites → drag the `pazl-site` folder onto the page (or "Add new site → Deploy manually").
2. Netlify gives the site a `something.netlify.app` address. Open it and check a project page and the studio page.

Later updates: drag the folder again, or Claude runs `netlify deploy --prod --dir=pazl-site` once the Netlify CLI is logged in.

## 2. Contact form (you, once)

Site configuration → Forms → make sure forms are enabled (Netlify detects the `contact` form at deploy time).
Then Forms → Form notifications → Add notification → Email notification → `info@pazlstudio.co`.
Submissions also stay in the Netlify dashboard under Forms → contact. Free tier: 100 submissions a month.

## 3. Domain (you)

Site configuration → Domain management → Add a domain → `pazlstudio.co`. Pick **"use external DNS"** (keep GoDaddy nameservers).

In GoDaddy → My Products → pazlstudio.co → DNS, delete the two parked A records on `@` (15.197.148.33 and 3.33.130.190) and any `www` record, then add:

| Type  | Name | Value                         | TTL |
|-------|------|-------------------------------|-----|
| A     | @    | 75.2.60.5                     | 600 |
| CNAME | www  | `<your-site>.netlify.app`     | 600 |

Netlify shows the exact values on the domain screen; use those if they differ. Leave GoDaddy forwarding off.
Netlify issues the HTTPS certificate itself once DNS resolves (usually within the hour). Set `pazlstudio.co` as the primary domain so `www` redirects to it.

## 4. Check (Claude)

```bash
dig +short pazlstudio.co A
dig +short www.pazlstudio.co CNAME
curl -sI https://pazlstudio.co | head -3
```

The old GitHub Pages address keeps working until the `pazl/` folder is removed from the P.STAR repo. The `CNAME` and `.github` files in the standalone GitHub copy are not needed for Netlify.
