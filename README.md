# telehealth-master

The master / marketing site for the telehealth portal. Built with [Astro](https://astro.build).

## Folder structure

```
telehealth-master/
├── public/              # static assets served as-is
│   ├── favicon.svg
│   ├── fonts/
│   └── images/
├── src/
│   ├── components/      # reusable .astro / framework components
│   ├── content/         # content collections (blog, pages, etc.)
│   ├── layouts/         # shared page shells
│   │   └── BaseLayout.astro
│   ├── pages/           # file-based routes
│   │   └── index.astro
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── tsconfig.json        # @/* → src/* alias
├── .env.example
└── package.json
```

## Commands

| Command           | Action                                      |
| ----------------- | ------------------------------------------- |
| `npm install`     | Install dependencies                        |
| `npm run dev`     | Start dev server at `localhost:4321`        |
| `npm run build`   | Build production site to `./dist/`          |
| `npm run preview` | Preview the production build locally        |

## Getting started

```bash
npm install
npm run dev
```

Then copy your base structure into `src/` and `public/`. Mobile-first: verify at 375px before adding desktop styles.
