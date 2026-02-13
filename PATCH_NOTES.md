# TypeScript build fix (Vercel)
This patch adds a minimal module declaration for `papaparse` so `next build` doesn't fail with:

  Could not find a declaration file for module 'papaparse'

How to apply:
- Unzip at the repository root (it will overwrite `next-env.d.ts`).
- Commit + push.

Alternative (more typed):
- `npm i -D @types/papaparse` and commit `package-lock.json`.

