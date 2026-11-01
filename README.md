# Clarke Projects — design options

Static site, no build step, plus one serverless function for the contact form. Hosted on Vercel: a push to `preview` gives a preview URL, `main` is production.

`/` lists the five options in review. Each option lives at its own path and will become the home page (`/`) of www.clarkeprojects.com once one is chosen (see `docs/launch-readiness.md`).

5A–5E share one home page (the Siskind first, then the other works in the same frame and label, 6 s each), About, Services, Special Projects, Instagram and Contact. They differ only in the Portfolio. On phones each moves one full page per scroll step, with page dots (eight pages).

| Option | Portfolio | Path |
|---|---|---|
| 5A | Index, museum style | `/option-5a-scroll/` |
| 5B | Instagram-style grid | `/option-5b-scroll/` |
| 5C | Gallery room | `/option-5c-scroll/` |
| 5D | Gallery wall, four at a time | `/option-5d-scroll/` |
| 5E | Box of prints | `/option-5e-scroll/` |

Shared pages: `/privacy/`, `/accessibility/`, and `404.html` for unknown addresses.

Earlier options and animation studies are in `archive/` (kept in the repository, not deployed).

## Files

| Path | What |
|---|---|
| `option-5?-scroll/index.html` | The five options (each self-contained: inline CSS, fonts and JS) |
| `api/enquiry.js` | Contact form → email via Resend (settings in Vercel environment variables, see the file header) |
| `tests/` | Contact form tests: `npm test` (Node's built-in runner, no dependencies) |
| `assets/` | Shared images, logo, fonts (`fonts.css`), `page.css` for the short text pages; artwork images in `assets/works/` (WebP, 800 and 1600 px) |
| `vercel.json` | Clean URLs, security headers, `noindex` on every host except www.clarkeprojects.com, caching |
| `robots.txt`, `sitemap.xml` | Written for the live domain |
| `.vercelignore` | Keeps `archive/`, `tests/`, `docs/` and this README out of deployments |
| `docs/` | Internal notes (not deployed) |

## Preview locally

```sh
npx serve .        # pages only; the contact form needs the function:
vercel dev         # pages + /api/enquiry/ (after `vercel link` and `vercel env pull .env.local`)
npm test           # contact form tests
```
