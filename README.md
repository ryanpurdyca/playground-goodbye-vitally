# see-you-sometime

An interactive 3D book rendered with CSS and SVG (no textures, no imported imagery). The book opens and closes following your mouse — pointer to the right closes it, pointer to the left fans it open.

## Quickstart

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Scripts

| Command             | Description                                            |
| ------------------- | ------------------------------------------------------ |
| `npm run dev`       | Start the Next.js dev server                           |
| `npm run build`     | Production build                                       |
| `npm run typecheck` | TypeScript `--noEmit`                                  |
| `npm run lint`      | ESLint                                                 |
| `npm run format`    | Prettier write                                         |
| `npm run test`      | Vitest in watch mode                                   |
| `npm run test:run`  | Vitest once                                            |
| `npm run test:e2e`  | Playwright E2E                                         |
| `npm run check`     | typecheck + lint + format:check + tests (PR-ready bar) |

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind v4 · Framer Motion · Vitest + RTL · Playwright.

## For agents

If you are an LLM working in this repo, **read [`AGENTS.md`](./AGENTS.md) first**. It is the canonical context for architecture, conventions, design system, and decisions. The pre-commit hook will refuse commits that change product code without updating it.
