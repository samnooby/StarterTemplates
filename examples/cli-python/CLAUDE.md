# greet-cli

Minimal Python CLI used to exercise the `test-cli` harness. Also a starting point for a new CLI.

## Commands

- Install: `uv sync`
- Run: `uv run greet Sam`
- Typecheck: `uv run pyright`
- Lint: `uv run ruff check .` and `uv run ruff format --check .`
- Test: `uv run pytest`
- Harness: from the plugin root, `cd harness && pnpm -s cli ../examples/cli-python/harness.spec.json`

## Layout

- `src/greet_cli/greeting.py` is the pure logic; `main.py` is the only place that touches argv, stdout, stderr and exit codes.
- `src/greet_cli/errors.py` holds `AppError` and its subclasses. `main` maps them to exit codes.
- `tests/` mirrors `src/greet_cli/`.
