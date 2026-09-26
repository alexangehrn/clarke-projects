# Clarke Projects — homepage options

Static site, no build step. Each option lives at its own path:

| Option | Path |
|---|---|
| J9 · One-page intro | `/j9-one-page-intro/` |
| J11 · Triptych | `/j11-triptych/` |
| J13 · Wall band | `/j13-wall-band/` |

Home-section explorations (first screen only): `/h1-wall-label/`, `/h2-passe-partout/`, `/h3-open-sky/`, `/h4-dive/`, `/h5-menu-index/`, `/h6-night/`.

`/` is an index linking to all three. Images are shared from `/assets/`.

## Preview locally

```sh
npx serve .
```

## Deploy

1. Push this folder to a GitHub repo.
2. In Vercel: **Add New → Project**, import the repo, Framework Preset **Other**, leave build and output settings empty, **Deploy**.

To add another option, create `new-name/index.html` (images as `../assets/…`) and add a line to `index.html`.
