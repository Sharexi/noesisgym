@AGENTS.md

# noesisgym

Public repo for the GPU net-earnings calculator. Static Next.js export
(`output: "export"`), Tailwind v4, shadcn-style components in
`src/components/ui`.

- Every number must point to an entry in `src/data/sources.ts` with an ISO
  date and an honest `verification` status. Computed values carry a
  `derivation`. Never present an estimate as a promise.
- Model changes go together with `src/lib/model.test.ts` and the formulas on
  `src/app/methodology/page.tsx`.
- Run `npm test && npm run lint && npm run typecheck && npm run build`
  before committing.
- This repo is public: no personal information, secrets or strategy notes.
