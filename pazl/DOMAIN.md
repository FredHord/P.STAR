# pazlstudio.co → GitHub Pages

## 1. GitHub (you)

1. https://github.com/new → name `pazl`, Public, no README / .gitignore / license → Create repository.
2. Tell Claude it exists. Claude pushes the prepared repo; the Actions workflow deploys it.
3. After the first deploy: repo → Settings → Pages → Custom domain → `pazlstudio.co` → Save.
   Tick **Enforce HTTPS** once GitHub shows the certificate as issued (can take up to an hour after DNS is right).

## 2. GoDaddy DNS (you)

My Products → pazlstudio.co → DNS. Delete the two parked A records on `@` (15.197.148.33 and 3.33.130.190) and any existing `www` record, then add:

| Type  | Name | Value                | TTL     |
|-------|------|----------------------|---------|
| A     | @    | 185.199.108.153      | 600     |
| A     | @    | 185.199.109.153      | 600     |
| A     | @    | 185.199.110.153      | 600     |
| A     | @    | 185.199.111.153      | 600     |
| CNAME | www  | fredhord.github.io   | 600     |

Leave the nameservers on GoDaddy (ns63/ns64.domaincontrol.com). Do not turn on GoDaddy forwarding.

## 3. Check (Claude)

```bash
dig +short pazlstudio.co A
dig +short www.pazlstudio.co CNAME
curl -sI https://pazlstudio.co | head -3
```

The old address https://fredhord.github.io/P.STAR/pazl/ keeps working until the `pazl/` folder is removed from P.STAR.
