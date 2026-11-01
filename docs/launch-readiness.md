# Clarke Projects: launch readiness review

Reviewed 1 November 2026. Scope: `option-5a-scroll` … `option-5e-scroll`, the contact function (`api/enquiry.js`), deployment configuration, and the new `/privacy/`, `/accessibility/` and `404.html`. One option will become the home page of www.clarkeprojects.com. This file is internal (excluded from deployments by `.vercelignore`).

Status keys: **Done** = implemented and verified · **Prod check** = implemented, verify on the live domain · **Owner** = requires owner information · **Review** = requires external/legal review · **N/A** = not applicable.

## 1. Launch blockers (exact action)

| # | Blocker | Action | Status |
|---|---|---|---|
| B1 | Client has not chosen an option | Ben picks one; then follow §7 "Go live" | Owner |
| B2 | Visible placeholders | Supply: contact email, phone, portrait photo credit, artwork captions (`[title, year]`, `[First name]`, `[surname]`, `[Artist]`), Special Projects captions (`[city, year]`), LinkedIn URL (link currently goes to linkedin.com). Confirm the inferred first names (Mutu, Struth, Sugimoto) | Owner |
| B3 | Privacy policy | Owner text in place (1 Nov 2026: sole proprietor, benjamin@clarkeprojects.com, 24-month enquiry retention). Still to do: set the effective date at publication; switch `ENQUIRY_TO` to Ben (the policy says only Benjamin has mailbox access; test enquiries currently go to Alexandra’s Gmail, delete them after testing); keep Vercel Firewall challenge/Bot Protection off unless the policy is updated (a challenge sets a cookie) | Owner |
| B4 | Accessibility page details | Fill in `[email]`, `[phone]`, review date in `/accessibility/` | Owner |
| B5 | Image licences and permissions | Written permission for: the Siskind (licence pending; may not be scaled or animated without the licensor's OK), every artwork image in Portfolio and on the home carousel (artist/estate/gallery or photographer, e.g. "Photograph: Dan Bradica" on Nguyen), installation photos (sites, people shown: art handlers, LaToya hang), and the portrait photographer. The draft Portfolio sentence ("…works placed in private collections are not reproduced here…") still awaits Ben's approval | Owner / Review |
| B6 | Image changes listed in §5 | At minimum: Install+LaToya file (shows the hung works in full; only CSS hides them) and the 5.2 MB portrait | Owner (Alexandra, manual) |
| B7 | Email sender domain | Verify clarkeprojects.com in Resend (DNS at Squarespace, needs Ben's login), set `ENQUIRY_FROM` to an @clarkeprojects.com address and `ENQUIRY_TO` to Ben; add SPF/DKIM (Resend's records) and a DMARC record. The domain has **no SPF and no DMARC today** (checked by DNS lookup); Google Workspace mail benefits from both too | Owner |

## 2. What changed in this review and why

| Area | Change | Status |
|---|---|---|
| Scope | Unlinked options and studies moved to `archive/` (asset paths adjusted so they still open locally) and excluded from deployments | Done |
| Security headers | `vercel.json`: Content-Security-Policy (self only; no third-party origins needed), `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`/`frame-ancestors`, `Permissions-Policy`. HSTS is left to Vercel's default (custom domains get `max-age=63072000`; no `includeSubDomains`/preload added) | Done locally (CSP enforced in browser tests); Prod check |
| Indexing | `X-Robots-Tag: noindex` on every host except www.clarkeprojects.com, so the vercel.app review site is not indexed while the live domain is, with no change needed at launch. `robots.txt` (all crawlers allowed, `/api/` disallowed, sitemap) and `sitemap.xml` written for the live domain | Done; Prod check |
| SEO | Canonical `https://www.clarkeprojects.com/` on each option; Open Graph/Twitter title and description; JSON-LD `Organization` + `Person` + `WebSite` using only visible facts (name, intro sentence, New York, University of Auckland, Instagram). No LocalBusiness (no street address); no logo in JSON-LD (the wordmark is 477×49, Google wants ≥112×112) | Done |
| Fonts | Removed the unused inline Cormorant face (29 KB per page; the logo is an SVG) | Done |
| LCP | `fetchpriority="high"` on the Siskind (the LCP element) | Done |
| Contact form (page) | Privacy line + link in the form hint; `maxlength`; honeypot renamed so browser autofill won't fill it (it was labelled "Company", which autofill can fill, silently dropping a real enquiry); invalid fields point to the alert (`aria-describedby`); "too fast" now shows a retry message instead of being silently dropped; idempotency key per enquiry so a retry after a timeout can't send twice; posts to `/api/enquiry/` directly (avoids a 308 redirect) | Done |
| Contact form (function) | JSON only (415 otherwise), cross-site Origin refused (403), string-type checks, over-long fields refused (no silent truncation), stricter single-address email check (Reply-To can't carry extra recipients), 8 s send timeout, `Cache-Control: no-store`, idempotency key forwarded to Resend, no submission content in logs, referrer reduced to origin + path | Done (12 tests) |
| Footer | Privacy and Accessibility links (27 px targets) on every option | Done |
| Accessibility | Escape closes the phone menu and returns focus to the button; 5B and 5D portfolio tiles now announce artist and title ("…, [title, year]. View larger") like 5A/5E | Done |
| New pages | `/privacy/`, `/accessibility/`, `404.html` (same palette and type) | Done; Owner details pending |
| Tooling | `package.json` (`npm test`, Node 22.x for the function), `tests/enquiry.test.js` | Done |

## 3. Remaining findings by severity

**High**
- B5/B6 above (image rights; LaToya file exposes the hung works).
- Vercel plan: the Hobby plan's terms limit it to non-commercial personal use and Vercel's DPA covers Pro/Enterprise only. Owner position (1 Nov 2026): the site is a non-commercial presentation site. Revisit if that changes.

**Medium**
- Portrait is 5.2 MB (≈90% of page weight; §5).
- Rate limit: the Vercel Firewall rule must match **starts with `/api/enquiry`** (the form now posts to `/api/enquiry/`; a rule on "equals /api/enquiry" no longer matches and could always be bypassed). Hobby: one rate-limit rule, fixed window 10 s–10 min, keyed by IP. Suggested: 5 requests / 10 min / IP, action 429. There is no global cap besides Resend's free quota (100 emails/day, 3,000/month), which then fails safely with the error alert.
- No favicon (a `data:` placeholder stops the 404). Search results show a generic icon until one exists (§5).
- Social preview image not yet published (`og:image` tags removed until the file exists; §5).
- Services wording to confirm with Ben (approved copy unchanged): "insurance appraisals" (does Clarke Projects perform appraisals, or arrange them with qualified appraisers?) and "estate planning" (collection side only, not legal/tax advice). If he doesn't perform appraisals himself, a small wording change avoids implying a qualification.

**Low**
- CSP needs `'unsafe-inline'` because scripts and styles are inline in each page. Acceptable here (no user content is ever rendered as HTML; the form uses `textContent`). Moving scripts to files would allow a stricter policy.
- 5C wall labels are 9.5 px in perspective; the same artist/title is in each work's accessible name and the 13.5 px caption.
- Honeypot and timing are secondary controls; a targeted bot can pass them. Escalation path if spam appears: Vercel Firewall rule tightening, then Vercel Bot Protection (challenge) or an invisible challenge. Not needed now.
- `logo.svg` is 29 KB (could be optimised with an SVG minifier).

## 4. Legal and privacy applicability (US-facing presentation site, contact form only)

Not legal advice; facts from official sources checked 1 Nov 2026.

| Law / duty | Applies? | Why | Implemented | Open |
|---|---|---|---|---|
| CalOPPA (Cal. Bus. & Prof. Code §22575) | Yes | Any commercial website operator collecting PII (name, email) from California residents; no size threshold | `/privacy/` linked from every page footer and beside the form ("Privacy" text link = conspicuous). Covers categories, recipients, change notice, effective date, Do Not Track | Effective date, legal name (B3) |
| CCPA/CPRA | Very likely no | Thresholds: >$26.625M revenue, or 100k+ CA consumers' data, or 50%+ revenue from selling data | Policy written so it remains accurate either way | Owner confirms revenue below threshold |
| NY SHIELD Act (GBL §899-aa/bb) | Limited | Form data (name, email, message) is not "private information" unless a visitor types e.g. an SSN or health details; small-business reasonable safeguards apply to any private information held | Policy asks visitors not to send sensitive data; HTTPS; no storage on the site; mailbox access limited | Keep mailbox access limited, 2FA on Google/Vercel/Resend accounts |
| NY comprehensive privacy law | No | None in force (NY Privacy Act still in committee) | — | — |
| GDPR (Art. 3(2)) | Unlikely | English US site; "International" alone doesn't show intent to target EU people (EDPB 3/2018). Would change with EU marketing, EU language/currency, or naming EU clients | Policy states US processing and offers access/correction/deletion to everyone | Revisit if Ben markets to EU clients |
| Cookie consent (ePrivacy/GDPR) | No | No cookies, storage, analytics or third-party requests (verified in code and in Chrome/Firefox/WebKit runs: no cookies, no localStorage/sessionStorage, no service worker, no off-site requests). Vercel Firewall challenge (only if enabled) would set a security cookie | No banner | Keep Vercel Web Analytics/Speed Insights off unless the policy is updated |
| ADA Title III | Uncertain for websites | DOJ (2022) says Title III covers web services but has no technical standard; WCAG is guidance. The 2024 WCAG rule covers state/local government only | WCAG 2.2 AA as engineering target; `/accessibility/` contact page | Fill in contact details (B4) |
| Copyright / image rights | Yes | Artworks, installation photos, portrait | Captions, no client attribution, "representative" sentence | B5 |
| Fonts | OK | Jost and Cormorant Garamond are SIL Open Font License (free to embed) | — | Licensed fonts still an open design decision |

Data flow: browser → HTTPS → Vercel function (US; request logs: IP, user agent, path; retention 1 h on Hobby) → DNS lookup of the email domain only → Resend API (US; keeps message + delivery log 30 days) → mailbox (Google Workspace for clarkeprojects.com; **currently Alexandra's Gmail for testing**). Nothing stored by the site; no backups. The function logs only status codes and Resend's short reason, never the submission.

Operational duties (not code): decide a mailbox retention period and delete old enquiries; answer access/deletion requests by email; 2FA on Vercel, Resend, Google and Squarespace; Resend's DPA is part of its terms; Vercel's DPA requires Pro.

## 5. Image changes for Alexandra (manual)

Rules: never crop, tint or scale the Siskind; setup photos stay black and white; strip metadata (EXIF/GPS) on every export; photos as WebP (all current browsers incl. Safari 14+). Tell Claude when files are in `assets/`: the HTML follow-up (srcset/sizes, crop CSS removal, OG and favicon tags, `.vercelignore`) is Claude's.

| # | File | Now | Make | Why |
|---|---|---|---|---|
| 1 | `install-latoya.webp` | 1000×1333 lossless, 1.16 MB; file shows the hung works (CSS shows only ladder + desk) | `install-latoya-crop.webp`: from `Installing LaToya.jpeg` crop only the area visible today (ladder, desk, floor; no artwork), aspect ≈ 15:16, at native resolution ≈ 640×680, greyscale, WebP q85. Delete the old file | Confidentiality; the visible part is now ~250 source px stretched to ~800 on retina (soft) |
| 2 | `portrait-head.jpg` | 3790×3618 JPEG, 5 MB | `portrait-head-800.webp` (800×764), `-1200` (1200×1146), `-1600` (1600×1528), `-2400` (2400×2291); same proportions, WebP q82. Optional: same widths as AVIF (~30% smaller) | 90% of page weight; shown full width on phones (≤1170 px at 3×) and half width on desktop (1440 px at 1440×2, 2560 px on 2560 screens) |
| 3 | `IMG_4657.webp` | 1000×1316, 433 KB | Same size, greyscale, WebP q80 (~150–200 KB) | Weight; it is always shown in black and white |
| 4 | `IMG_4656.webp` | 1000×1304, 187 KB | Same size, greyscale, WebP q80, no metadata | Weight, consistency |
| 5 | `works/lawson-800/-1600.webp` | both 544×776 (identical; only a small source exists) | Ask Ben for a larger image; then `lawson-800` (≈560×800) and `lawson-1600` (≈1120×1600) | Soft in the carousel, pop-up and room |
| 6 | `og-image.png` (new) | — | 1200×630 PNG (<100 KB): logo + "ART ADVISORY & COLLECTION MANAGEMENT" + "New York · International" on #D9E5EC. No artwork | Link previews |
| 7 | Favicon (new) | none | `favicon.svg` (mark from the logo), `favicon.ico` (16/32/48), `apple-touch-icon.png` 180×180 on #D9E5EC | Browser tab, Google results, iPhone home screen |
| 8 | `logo-512.png` (optional) | — | 512×512, logo centred on white | Structured-data logo (Google wants ≥112×112) |
| 9 | `logo.svg` (optional) | 28 KB | Minify (e.g. SVGO), same look | Loaded on every page |

No new files needed, HTML only (Claude): the carousel, Portfolio and 5C room use the `-800` works files at up to ~590 CSS px wide; adding `srcset` with the existing `-1600` files makes them sharp on retina screens.

No change: `siskind.jpg` (licence), `works/struth-*` (source is 1396 px, the maximum available), other `works/*`.

Unused by the five options (deployed, can be deleted or kept): `works/hancock-1600.webp`, `works/install-8417-1600.webp`, `works/process-7198-1600.webp`, `works/process-7872-800.webp`, `works/process-7872-1600.webp`; `portrait-head.jpg` once item 2 is done (Claude moves it out of the deployment).

## 6. Test evidence (1 Nov 2026, local)

Environments: macOS, Chrome (stable, via Playwright), Firefox 130 and WebKit (Playwright builds; **emulated, not a real Safari/iPhone or Android device**), Node 20.19 for tests. Server: `python3 -m http.server` on the repo; CSP from `vercel.json` injected into every response in the browser runs.

| Check | Command / method | Result |
|---|---|---|
| Function tests | `npm test` | 12/12 pass: valid send (plain text, fixed recipient, Reply-To, idempotency key), international names, company domains, typos/null-MX, CRLF/comma/bracket injection, wrong types, oversize, bad JSON, 405/415/403, honeypot, missing timing, too-fast, Resend 429 and timeout (logs contain no submission), not-configured, 20 concurrent, slow DNS fallback |
| Form end to end | real pages + real function + fake Resend, 5 options × 390/1440 | too-fast message; required-field alert with focus and `aria-describedby`; real DNS refuses `gmial.con`; provider failure keeps the text; retry reuses the same key; success clears; HTML 429 page → rate-limit message |
| Layout | 7 pages × 320, 375, 390, 640 (≈200% zoom), 768, 844×390 landscape, 1024, 1440, 1920 | Chrome, Firefox, WebKit: no horizontal overflow, no clipped phone pages, no console/CSP errors, no off-site requests, no cookies/storage, one H1 |
| Automated accessibility | axe-core 4.10 (WCAG 2.0–2.2 A/AA + best practice) at 390 and 1440 | 0 violations on all 7 pages. Contrast items axe could not decide (text on gradients/images) measured from screenshots: all pass or are hidden/covered labels |
| Keyboard | Tab through each option (desktop and phone) | skip link first and visible; focus ring on every stop; no traps; phone menu opens with Enter, closes with Escape (focus back on Menu); portfolio pop-up opens by keyboard, focus on Close, Escape closes, focus returns (5A, 5B, 5D, 5E; 5C moves the camera instead) |
| Reduced motion | `prefers-reduced-motion: reduce` | home carousel does not advance |
| Performance (lab, before) | Lighthouse 12, simulated mobile (Moto G Power, slow 4G, 4× CPU), production URL | 5A: score 86, LCP 2.8 s, CLS 0.03, TBT 370 ms, 5.6 MB. 5C: 92, LCP 3.4 s, CLS 0.04, 5.5 MB. LCP element: the Siskind. Desktop 5A: 100, LCP 0.5 s. Lab only; no field data exists (no analytics, too little traffic for CrUX). TBT is not INP |

Not tested / still to do: a screen reader pass (VoiceOver on macOS and iOS: menu, pop-ups, form errors); real iPhone Safari and Android Chrome (keyboard open over the form, swipe pages); Lighthouse "after" on the preview URL once images are replaced (the portrait dominates the result).

## 7. Go live (when Ben has chosen)

1. Fill all Owner items in §1; replace images (§5).
2. Make the chosen option the home page: copy `option-5X-scroll/index.html` to `index.html`, change `../assets/` to `assets/`, keep `/privacy/` and `/accessibility/`; delete the other option folders (they remain in git history and `archive/` if wanted). Add the OG image tags back once `og-image.png` exists.
3. Vercel → Domains: add `www.clarkeprojects.com` (primary) and `clarkeprojects.com` (redirect to www). At Squarespace DNS set the records Vercel shows (A for the apex, CNAME `www`). Leave the MX (Google) records untouched.
4. Resend domain verification and `ENQUIRY_FROM` / `ENQUIRY_TO` (B7); redeploy.
5. Firewall rate-limit rule "starts with /api/enquiry" (§3).
6. Merge `preview` → `main` only when Alexandra says "publish".
7. Smoke test on the live domain:
   - `curl -sI https://www.clarkeprojects.com/` → 200, CSP and other headers, **no** `x-robots-tag`; `curl -sI https://<project>.vercel.app/` → `x-robots-tag: noindex`.
   - `/robots.txt`, `/sitemap.xml`, `/privacy/`, `/accessibility/` → 200; `/nope/` → 404 page; `/README.md`, `/archive/option-1/`, `/tests/enquiry.test.js` → 404.
   - `http://clarkeprojects.com` → 308 → `https://www.clarkeprojects.com/`.
   - Send one enquiry; check Gmail "Show original": SPF, DKIM, DMARC = PASS.
   - Browser console clean on the home page.
8. Google Search Console: add a Domain property for clarkeprojects.com (TXT record at Squarespace), submit `https://www.clarkeprojects.com/sitemap.xml`, inspect `/`. Bing Webmaster Tools: import from Search Console. No analytics needed.
9. AI crawlers: all allowed (search, assistants and training). If Ben prefers to opt out of **training only**, add `Disallow: /` groups for GPTBot, ClaudeBot, Google-Extended and Applebot-Extended in `robots.txt`; search visibility is unaffected. Check Vercel Firewall → Bot Management stays off (it is off by default). No `llms.txt` is needed (Google: no special files required).

**Rollback:** Vercel → Deployments → previous production deployment → "Instant Rollback" (or `git revert` on `main` and push). Environment variable changes need a redeploy to apply or undo.

**Monitoring (no analytics):** Resend dashboard (delivery failures, bounces); Vercel → Logs for `Enquiry form:` errors; a monthly test enquiry. Domain renewal at Squarespace (auto-renew on); TLS certificates renew automatically at Vercel.

## 8. Recommendation

**Engineering: ready with non-blocking follow-ups** for the five options as a review site, and for launch once the image changes (§5) are made.
**Launch overall: NOT READY**, because of the owner and legal items B1–B7 (choice of option, placeholders, privacy details, image rights, email domain). Each has a single owner action listed above.
