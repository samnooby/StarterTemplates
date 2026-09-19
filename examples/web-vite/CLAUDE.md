# example-web-vite

Minimal Vite + React app used to exercise the `test-web` harness. Also a starting point for a new single-page app.

## Commands

- Install: `pnpm install`
- Run: `pnpm dev` (port 5173)
- Typecheck: `pnpm typecheck`
- Lint: `pnpm lint` and `pnpm format:check`
- Test: `pnpm test`
- Harness: from the plugin root, `harness/with-app.sh --cwd examples/web-vite --port 5173 --start "pnpm dev" --check "cd ../../harness && pnpm -s web ../examples/web-vite/harness.spec.json"`

## Layout

- `src/Counter/` holds the component, its hook, its CSS Module and its test together.
- `src/styles/tokens.css` defines the design tokens every stylesheet uses.
