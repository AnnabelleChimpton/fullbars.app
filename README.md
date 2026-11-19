# fullbars.app

The Fullbars marketing site: plain HTML and CSS, about 120 lines of JavaScript, no build step, no tracking. It's
hosted on GitHub Pages from a separate public repo, because the main repo is private.

```
index.html          home: what it is, the dead-zone route, how it compares, new in 0.6, FAQ, licences
setup/index.html    the setup guide, steps 1–5 including the BRB server
404.html            "Signal lost."
styles.css          tokens from docs/design/DESIGN-SPEC.md §1 (Ink ladder, Bone, health colours, rS/rM, motion)
site.js             the dead-zone simulation, the ruler cursor, the Copy keys (reduce-motion: nothing moves on its own)
fonts/              Archivo + JetBrains Mono, the app's subsets converted to WOFF2, with their OFL texts
img/                the four 0.6 screenshots and og.png (social preview)
CNAME               fullbars.app
.nojekyll           serve the files as they are
```

Preview locally: `python3 -m http.server 8411 --directory site`, then open http://localhost:8411. The pages use
root-relative paths (`/styles.css`), so open them through a server, not as files.

## Before it goes live

The site links to the main repo, which must be **public** first:

- **Download** buttons go to `https://github.com/AnnabelleChimpton/fullbars/releases/latest`, so the latest release
  needs the APK attached.
- The setup guide's step 4 runs `git clone https://github.com/AnnabelleChimpton/fullbars.git`.
- "Report a problem" goes to that repo's Issues (turn them on), and the setup guide links
  `docs/guides/BRB-SERVER.md` on `main`.
- The home page says "free and open source".

## Deploy

1. Create the public repo `AnnabelleChimpton/fullbars.app` (empty, no README).
2. Copy the contents of this folder to the root of that repo and push to `main`:

   ```bash
   git clone https://github.com/AnnabelleChimpton/fullbars.app.git ~/GitHub/fullbars.app
   rsync -a --delete --exclude .git site/ ~/GitHub/fullbars.app/
   cd ~/GitHub/fullbars.app && git add -A && git commit -m "Site" && git push
   ```

3. In the repo: **Settings › Pages**. Source: **Deploy from a branch**, branch `main`, folder `/ (root)`. The custom
   domain fills in from `CNAME`; if it doesn't, type `fullbars.app` and save.
4. Add the DNS records below at your registrar.
5. When the DNS check passes and GitHub has issued the certificate, tick **Enforce HTTPS**. `.app` domains only
   work over HTTPS (the whole TLD is on browsers' HSTS preload list), so the site won't open at all until the
   certificate is there. That can take up to an hour after DNS resolves.

To update the site later, change the files here, then repeat step 2.

## DNS records

At your registrar, for `fullbars.app`. Remove any other A, AAAA or CNAME records on `@` and `www` first (parking
pages, URL forwarding).

| Type | Name | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |
| CNAME | www | annabellechimpton.github.io |

GitHub redirects `www.fullbars.app` to `fullbars.app` once both are set.

**Recommended:** verify the domain for your account, so nobody else's Pages site can claim it. GitHub › your
**Settings › Pages › Add a domain**, enter `fullbars.app`, and it shows a TXT record (named
`_github-pages-challenge-annabellechimpton`) to add at the registrar. Then click **Verify**.

Check the records with:

```bash
dig +short fullbars.app A
dig +short fullbars.app AAAA
dig +short www.fullbars.app CNAME
```

## Rules for edits

- **Claims must be true today.** Check the main repo's README and `docs/R*-PROGRESS.md`. Say plainly what's Labs or
  untested.
- **Copy:** BRAND.md's voice. Plain, short, second person. No "boost", no "no subscription", no hype words, no "!".
- **Design:** DESIGN-SPEC.md. Mono only for figures. Health colours only where they mean health, Twitch purple only on
  the Continue with Twitch button. Radii 2px and 6px (the health pill is the one full radius). No gradients, glows,
  emoji or illustrations.
- **Never publish:** the BRB server's address, stream keys, pairing links, helper or hotspot passwords, the Twitch
  Client ID, or screenshots showing a room, a camera view, notifications or the Helper phones page. The commands use
  `YOUR_SERVER_ADDRESS` and the example address `203.0.113.7` (reserved for documentation).
- **Fonts** are subsets (Basic Latin, Latin-1, Latin Extended-A, General Punctuation, plus a few signs). There's no €
  or ✓; check with fontTools before using an unusual character.
