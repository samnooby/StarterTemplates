# <project name>

<one sentence: what this app is and who uses it>

## Commands

Package manager: `pnpm`. Never use npm or yarn here.

- Install: `pnpm install`
- Run: `pnpm dev` then open <http://localhost:3000>
- Typecheck: `pnpm typecheck` (`tsc --noEmit`)
- Lint: `pnpm lint` (`next lint` or `eslint .`) and `pnpm format:check` (`prettier --check .`)
- Test: `pnpm test` (`vitest run`); component tests use Testing Library
- Build: `pnpm build`

A change is done only when typecheck, lint, format check and tests all pass, and the affected page or route has been loaded in the running dev server and observed working.

## Layout

App router.

- `app/` routes, layouts, route handlers and server actions. Follow Next.js file conventions exactly.
- `components/<Name>/<Name>.tsx`, `<Name>.module.css`, `use<Name>.ts` and `<Name>.test.tsx` together in one folder.
- `lib/` framework-independent code: schemas, domain logic, data access.
- `lib/config.ts` parses environment variables once. Client code only sees `NEXT_PUBLIC_*` values via that module.

## Conventions

The full style rules are in `.claude/rules/` and load automatically for matching files. The short version: server components by default with the smallest possible `'use client'` islands, `interface XProps` plus `function X()`, logic in `useX` hooks, CSS Modules with design tokens, zod-parsed input on every server action and route handler, no comments, strict types with no escape hatches, tests first.

## Workflow

- Plan first for anything beyond a one-line change, and wait for approval.
- Red, green, refactor. Write the failing test before the implementation.
- Small Conventional Commits. Never commit on `main`.
