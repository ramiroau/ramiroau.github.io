# My webpage

`Hello World!`

## Comandos

`hugo --cleanDestinationDir --buildDrafts --buildFuture --buildExpired`

(forzar correccionse)

Actualización: 

`git add .`
`git commit -m "Whatever"`
`git push origin main`

## To solve localhost problem

`hugo --cleanDestinationDir` and in config: 

`relativeURLs = true`

│                │                            │                            │       │
│  type_content  │ Heading on /publicaciones/ │      Single template       │  In   │
│                │                            │                            │  use  │
├────────────────┼────────────────────────────┼────────────────────────────┼───────┤
│ working_papers │ Trabajos en curso          │ working_papers/single.html │ 4     │
├────────────────┼────────────────────────────┼────────────────────────────┼───────┤
│ en_prensa      │ En prensa                  │ en_prensa/single.html      │ 2     │
├────────────────┼────────────────────────────┼────────────────────────────┼───────┤
│ articulos      │ Artículos                  │ articulos/single.html      │ 18    │
├────────────────┼────────────────────────────┼────────────────────────────┼───────┤
│ capitulos      │ Capítulos / Obras          │ capitulos/single.html      │ 16    │
│                │ colectivas                 │                            │       │
├────────────────┼────────────────────────────┼────────────────────────────┼───────┤
│ reviews        │ Reseñas                    │ reviews/single.html        │ 1     │
├────────────────┼────────────────────────────┼────────────────────────────┼───────┤
│ retirados      │ Retirados                  │ retirados/single.html      │ 1     │