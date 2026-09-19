# <project name>

<one sentence: what this project is and who uses it>

## Commands

Environment and packages: `uv`. Never bare `pip`, never activate a venv by hand in scripts.

- Install: `uv sync`
- Run: `uv run <entry point>` (for example `uv run python -m <package>` or `uv run uvicorn <package>.main:app --reload`)
- Typecheck: `uv run pyright`
- Lint: `uv run ruff check .` and `uv run ruff format --check .`
- Test: `uv run pytest`
- Add a dependency: `uv add <name>` (`uv add --dev <name>` for tooling)

A change is done only when pyright, ruff check, ruff format check and pytest all pass, and the change has been exercised in the running application or CLI.

## Layout

- `src/<package>/` application code, grouped by feature. Follow the framework's conventions (FastAPI routers, Django apps) where one applies.
- `tests/` mirrors `src/<package>/`: `src/<package>/billing/invoice.py` is tested by `tests/billing/test_invoice.py`.
- `src/<package>/config.py` parses environment into a frozen pydantic settings model once. Nothing else reads `os.environ`.
- `src/<package>/errors.py` holds `AppError` and shared subclasses; feature-specific errors live in the feature.

## Conventions

The full style rules are in `.claude/rules/` and load automatically for matching files. The short version: full type annotations with no `Any` and no ignores, frozen slots dataclasses internally, pydantic at the boundaries, typed exceptions raised at detection and caught only in `main` or handlers, keyword-only arguments past two parameters, no comments, tests first.

## Workflow

- Plan first for anything beyond a one-line change, and wait for approval.
- Red, green, refactor. Write the failing test before the implementation.
- Small Conventional Commits. Never commit on `main`.
