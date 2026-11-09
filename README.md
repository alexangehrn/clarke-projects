# Clarke Projects — design options

Static site, no build step, plus one serverless function for the contact form. Hosted on Vercel: a push to `preview` gives a preview URL, `main` is production.

`/` lists the five options in review. Each option lives at its own path and will become the home page (`/`) of www.clarkeprojects.com once one is chosen (see `docs/launch-readiness.md`).

5B has the round-3 home page (the Siskind first, then the other works in frame and mat), About, Services, Portfolio (Instagram-style grid), Special Projects, Instagram and Contact; eight pages on phones. 5H is 5B revised with Ben’s feedback of 9 Nov 2026: new home images (works and installation photographs, no frame), no Special Projects, Instagram after Contact (seven pages on phones). 5I–5K are variations of 5H.

| Option | What differs | Booking button (Calendly) | Path |
|---|---|---|---|
| 5B | Instagram-style grid (round 3) | Button in the fixed menu bar, “Book a consultation” (“Book” on phones), and an outlined one below “Send enquiry” | `/option-5b-scroll/` |
| 5H | 5B with Ben’s new images and texts (9 Nov 2026) | Outlined button below “Send enquiry” | `/option-5h-scroll/` |
| 5I | As 5H, home images all at one height (nothing cropped) | Section under the email address: rule, “Complimentary consultation”, outlined “Book a time” button | `/option-5i-scroll/` |
| 5J | As 5H, Portfolio on phones as the 5E box of prints (swipe) | Bar that slides up after the first page and stays, also on Contact (can be closed) | `/option-5j-scroll/` |
| 5K | As 5J, home works framed and matted as in 5B | Section under the email: a button with a drawn calendar page | `/option-5k-scroll/` |

Every booking button opens one shared pop-up. Until Benjamin’s Calendly link is set (`calLink` in each page’s last script) the pop-up shows a placeholder; with the link it shows his Calendly page in a frame (`frame-src https://calendly.com` is allowed in `vercel.json`). Nothing from Calendly loads before a visitor opens it.

Shared pages: `/privacy/`, `/accessibility/`, and `404.html` for unknown addresses.

Earlier options and animation studies are in `archive/` (kept in the repository, not deployed), including 5A, 5C–5G scroll (archived 9 Nov 2026 without the booking button; their images point to `../../assets/`).

## Files

| Path | What |
|---|---|
| `option-5?-scroll/index.html` | The five options (each self-contained: inline CSS, fonts and JS) |
| `api/enquiry.js` | Contact form → email via Resend (settings in Vercel environment variables, see the file header) |
| `tests/` | Contact form tests: `npm test` (Node's built-in runner, no dependencies) |
| `assets/` | `fonts.css`, `page.css` (short text pages) and the images: `works/` (artworks, several widths), `special/`, `portrait/`, `instagram/`, `brand/` (logo, link-preview image). Names are `<subject>-<width>.webp`; images are cached for a year, so a changed image needs a new name. Originals (full-size sources) are in `archive/assets/originals/` and `assets/images to use/` (both git-ignored, never deployed) |
| `favicon.ico`, `favicon-192.png`, `apple-touch-icon.png` | Browser and home-screen icons (the Siskind, scaled down) |
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
