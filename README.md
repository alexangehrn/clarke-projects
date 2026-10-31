# Clarke Projects — design options

Static site, no build step. `/` lists all options; each one lives at its own path.

The index (`/`) lists Option 5 (Benjamin's favourite, unchanged), the current round 5D–5H, then the previous round 5A–5C.

5D–5H share one home page (the Siskind first, then the other works in the same frame and label, 3 s each), About, Services, Special Projects, Instagram and Contact. They differ only in the Portfolio.

| Option | Name | Path |
|---|---|---|
| 5 | Gallery style, Blocks (unchanged) | `/option-5/` |
| 5D | Portfolio index, museum style | `/option-5d/` |
| 5E | Portfolio as an Instagram grid | `/option-5e/` |
| 5F | Portfolio in a gallery room | `/option-5f/` |
| 5G | Portfolio on a spotlight wall | `/option-5g/` |
| 5H | Portfolio box | `/option-5h/` |

### Previous round

| Option | Name | Path |
|---|---|---|
| 5A | Rotating works, Portfolio grid | `/option-5a/` |
| 5B | Works with arrows, one Portfolio | `/option-5b/` |
| 5C | Siskind stays, Portfolio index | `/option-5c/` |

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
