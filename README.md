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

Images and fonts are shared from `/assets/`.

## Preview locally

```sh
npx serve .
```

## Add an option

Create `option-x/index.html` (images as `../assets/…`) and add a line to `index.html`.

## Animation studies (explorations, not design proposals)

| Study | Name | Path |
|---|---|---|
| 7A | Entering the gallery, corridor: one entrance walk, then Option 1 as a normal page | `/option-7a/` |
| 7B | Entering the gallery, along the wall: one entrance glide, then Option 1 as a normal page | `/option-7b/` |
| 8A | Gallery walk, corridor loop: arrows move one room clockwise | `/option-8a/` |
| 8B | Gallery walk, rotunda: arrows turn clockwise, plan to jump | `/option-8b/` |
