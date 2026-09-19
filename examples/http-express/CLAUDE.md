# example-http-express

Minimal Express 5 API in TypeScript used to exercise the `test-http` harness. Also a starting point for a new HTTP service.

## Commands

- Install: `pnpm install`
- Run: `pnpm dev` (listens on `PORT`, default 3000)
- Typecheck: `pnpm typecheck`
- Lint: `pnpm lint` and `pnpm format:check`
- Test: `pnpm test`
- Harness: from the plugin root, `harness/with-app.sh --cwd examples/http-express --port 3000 --start "pnpm dev" --check "cd ../../harness && pnpm -s http ../examples/http-express/harness.spec.json"`

## Layout

- `src/app.ts` builds the app from a `TodoStore`; `src/server.ts` is the only file that reads config and listens.
- `src/todos/` holds the schema, the store and the routes for the one feature.
- `src/errors.ts` holds `AppError` and its subclasses; the error handler in `app.ts` maps them to responses.
