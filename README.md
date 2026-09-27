# Clarke Projects — design options

Static site, no build step. `/` lists all options; each one lives at its own path.

| Option | Name | Path |
|---|---|---|
| 1 | Gallery style | `/option-1/` |
| 2 | Art selection style, Left aligned | `/option-2/` |
| 3A | Art selection style, Center aligned, Legend on sides | `/option-3a/` |
| 3B | Art selection style, Center aligned, Legend on bottom banner | `/option-3b/` |
| 4A | Art Background, Blue | `/option-4a/` |
| 4B | Art Background, Grey | `/option-4b/` |
| 5 | Gallery style, Blocks | `/option-5/` |
| 6 | Different pages navigation: `/option-6/`, `/option-6/about/`, `/option-6/services/`, `/option-6/contact/` | `/option-6/` |
| 7A | 3D Gallery walk, Corridor loop: clockwise square corridor | `/option-7a/` |
| 7B | 3D Gallery walk, Rotunda: hexagonal room, turn clockwise, plan | `/option-7b/` |
| 8A | One entrance walk down a corridor to the Siskind, then Option 1 as a normal page | `/option-8a/` |
| 8B | One entrance glide along a gallery wall to the Siskind, then Option 1 as a normal page | `/option-8b/` |

Images and fonts are shared from `/assets/`.

## Preview locally

```sh
npx serve .
```

## Add an option

Create `option-x/index.html` (images as `../assets/…`) and add a line to `index.html`.

All walks: arrows (or keyboard) move one room clockwise; menu, plan and map jump directly.
