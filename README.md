# Clarke Projects — design options

Static site, no build step. `/` lists all options; each one lives at its own path.

The index (`/`) lists only the scroll versions 5A–5E (labelled Option 5A–5E). Option 5 and the non-scroll 5A–5E stay online but are not linked.

5A–5E share one home page (the Siskind first, then the other works in the same frame and label, 6 s each), About, Services, Special Projects, Instagram and Contact. They differ only in the Portfolio. Each "scroll" version is identical on desktop; on phones it moves one full page per scroll step, with page dots (eight pages).

| Option | Name | Path |
|---|---|---|
| 5 | Gallery style, Blocks (unchanged) | `/option-5/` |
| 5A | Portfolio index, museum style | `/option-5a/` |
| 5A scroll | Portfolio index, museum style, page-by-page on phones | `/option-5a-scroll/` |
| 5B | Portfolio as an Instagram grid | `/option-5b/` |
| 5B scroll | Portfolio as an Instagram grid, page-by-page on phones | `/option-5b-scroll/` |
| 5C | Portfolio in a gallery room | `/option-5c/` |
| 5C scroll | Portfolio in a gallery room, page-by-page on phones | `/option-5c-scroll/` |
| 5D | Portfolio on a gallery wall, four at a time | `/option-5d/` |
| 5D scroll | Portfolio on a gallery wall, four at a time, page-by-page on phones | `/option-5d-scroll/` |
| 5E | Portfolio box | `/option-5e/` |
| 5E scroll | Portfolio box, page-by-page on phones | `/option-5e-scroll/` |

### Earlier rounds (still online, not linked from the index)

| Option | Name | Path |
|---|---|---|
| 1 | Gallery style | `/option-1/` |
| 2 | Art selection style, Left aligned | `/option-2/` |
| 3A | Art selection style, Center aligned, Legend on sides | `/option-3a/` |
| 3B | Art selection style, Center aligned, Legend on bottom banner | `/option-3b/` |
| 4A | Art Background, Blue | `/option-4a/` |
| 4B | Art Background, Grey | `/option-4b/` |
| 6 | Different pages navigation: `/option-6/`, `/option-6/about/`, `/option-6/services/`, `/option-6/contact/` | `/option-6/` |

Images and fonts are shared from `/assets/`. Web-sized artwork and process images for the round 2 options are in `/assets/works/` (WebP, 800 and 1600 px).

## Preview locally

```sh
npx serve .
```

## Add an option

Create `option-x/index.html` (images as `../assets/…`) and add a line to `index.html`.

## Animation studies (explorations, not design proposals; not linked from the index)

| Study | Name | Path |
|---|---|---|
| 7A | Entering the gallery, corridor: one entrance walk, then Option 1 as a normal page | `/option-7a/` |
| 7B | Entering the gallery, along the wall: one entrance glide, then Option 1 as a normal page | `/option-7b/` |
| 8A | Gallery walk, corridor loop: arrows move one room clockwise | `/option-8a/` |
| 8B | Gallery walk, rotunda: arrows turn clockwise, plan to jump | `/option-8b/` |
