# <project name>

<one sentence: what this project is and who uses it>

## Commands

Package manager: `pnpm`. Never use npm or yarn here.

- Install: `pnpm install`
- Run: `pnpm dev`
- Typecheck: `pnpm typecheck` (`tsc --noEmit`)
- Lint: `pnpm lint` (`eslint .`) and `pnpm format:check` (`prettier --check .`)
- Test: `pnpm test` (`vitest run`); watch with `pnpm test:watch`
- Build: `pnpm build`

A change is done only when typecheck, lint, format check and tests all pass, and the change has been exercised in the running app through the `test-http` harness (spec in `harness.spec.json`).

## Layout

- `src/` application code, grouped by feature. Each feature folder holds its modules, schemas and tests together.
- `src/<feature>/<name>.ts` with `src/<feature>/<name>.test.ts` beside it.
- `src/config.ts` parses environment variables once into a typed config object. Nothing else reads `process.env`.
- `src/errors.ts` holds the base `AppError` and shared error classes; feature-specific errors live in the feature.

## Conventions

The full style rules are in `.claude/rules/` and load automatically for matching files. The short version: names carry meaning, no comments, strict types with no escape hatches, typed thrown errors, zod schema-first with inferred types, named `function` declarations, named exports, tests first.

## Workflow

- Plan first for anything beyond a one-line change, and wait for approval.
- Red, green, refactor. Write the failing test before the implementation.
- Small Conventional Commits. Never commit on `main`.
