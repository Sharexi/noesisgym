# noesisgym

What a home GPU really nets from rental marketplaces, after platform cut,
electricity and idle time. Live at [noesisgym.com](https://noesisgym.com).

Every figure is sourced, dated and labelled with how far it has been
verified. Estimates for information only, not financial advice. No affiliate
links.

## Where things are

| Path | What |
|---|---|
| `src/lib/model.ts` | The calculation model (documented on `/methodology`) |
| `src/lib/model.test.ts` | Tests, including a hand-computed example |
| `src/data/inputs.ts` | GPU, price and electricity figures, each pointing to a source |
| `src/data/sources.ts` | Every source with its date and verification status |
| `src/data/live.json` | Figures refreshed daily by `.github/workflows/update-data.yml` (`node scripts/update-data.mjs`) |

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # model and data checks
npm run lint
npm run typecheck
npm run build      # static site in out/
```

## Deploy

Served from Cloudflare Workers static assets (`wrangler.jsonc`). Cloudflare
builds each push to `main` with `npm run build` and deploys with
`npx wrangler deploy`.

## Corrections

Found a wrong or outdated number? Open an issue with a link to a better
source.
