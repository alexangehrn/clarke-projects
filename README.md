# Clarke Projects — design options

Static site, no build step. `/` lists all options; each one lives at its own path.

| Option | Name | Path |
|---|---|---|
| 1 | Wall label | `/option-1/` |
| 2 | One-page intro | `/option-2/` |
| 3a | Triptych | `/option-3a/` |
| 3b | Wall band | `/option-3b/` |
| 4a | Open sky, blue | `/option-4a/` |
| 4b | Open sky, grey | `/option-4b/` |

Images and fonts are shared from `/assets/`.

## Preview locally

```sh
npx serve .
```

## Add an option

Create `option-x/index.html` (images as `../assets/…`) and add a line to `index.html`.
