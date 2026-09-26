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
| 9A | 3D Gallery walk, Corridor loop: clockwise square corridor | `/option-9/` |
| 9B | 3D Gallery walk, Rooms and doorways: the same loop, a doorway with a sign on each leg | `/option-9b/` |
| 9C | 3D Gallery walk, Promenade: around the walls of one square room | `/option-9c/` |
| 9D | 3D Gallery walk, Rotunda: hexagonal room, turn clockwise, plan | `/option-9d/` |

Images and fonts are shared from `/assets/`.

## Preview locally

```sh
npx serve .
```

## Add an option

Create `option-x/index.html` (images as `../assets/…`) and add a line to `index.html`.

All walks: arrows (or keyboard) move one room clockwise; menu, plan and map jump directly.
