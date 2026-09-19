---
paths:
  - "**/*.py"
  - "**/pyproject.toml"
---

# Python rules

## Tooling

- `uv` for environments, dependencies and running. `uv run pytest`, `uv add httpx`, never bare `pip` or a manually activated venv in scripts or docs.
- `ruff` for both linting and formatting. `ruff check` and `ruff format --check` are part of the definition of done.
- `pyright` in strict mode (or `mypy --strict` if the project already uses it). The type checker passing is part of the definition of done.
- Python 3.12 or newer for new projects. Use modern syntax: `X | None`, `list[str]`, `match`, `type` aliases, PEP 695 generics.
- `pytest` for tests.

## Types, no escape hatches

- Every function signature is fully annotated, including return types and `-> None`.
- Never `Any` in project code. Use `object` and narrow, or a `TypedDict`, `Protocol` or model.
- Never `# type: ignore` or `cast()` without a one-line reason, and treat both as a bug to remove.
- Prefer `Protocol` for structural interfaces over ABCs.
- Use `Final` for module constants and `Literal` for closed sets of strings.
- Use `NewType` for IDs that could be confused (`UserId = NewType("UserId", str)`).

## Data

- Internal data is `@dataclass(frozen=True, slots=True)`. Immutable by default.
- Data at a boundary (HTTP, config, files, external APIs) is a `pydantic.BaseModel` parsed once at the edge. Internal code never sees a raw `dict`.
- Prefer tuples over lists for fixed collections passed around; prefer `Mapping` and `Sequence` in signatures over `dict` and `list` when the function does not mutate.
- `pathlib.Path` for paths. Never string concatenation for paths.
- `datetime` is always timezone-aware.

## Functions and modules

- Module-level functions over classes. A class exists when state and behaviour belong together and the instance has a lifecycle.
- Guard clauses first, happy path unindented.
- No mutable default arguments.
- Keyword-only arguments (`*,`) for any function with more than two parameters or any boolean parameter.
- `snake_case` for functions, variables, modules and files; `PascalCase` for classes; `UPPER_SNAKE_CASE` for constants.
- Use `__all__` only in a package `__init__.py` that is a public API. Otherwise no `__init__.py` re-exports.

## Errors

- A project base exception (`class AppError(Exception)`), and one subclass per failure a caller could handle. Store the identifying value as an attribute.

```python
class UserNotFoundError(AppError):
    def __init__(self, user_id: UserId) -> None:
        self.user_id = user_id
        super().__init__(f"User {user_id} not found")
```

- Never bare `except:` or `except Exception:` outside a top-level boundary (CLI `main`, request handler, worker loop).
- Re-raise with `raise ... from err` when wrapping.
- Never return `None` to signal failure when a caller needs to know why. Raise.

## Async

- `asyncio` with `async def` end to end when the project is async. Never mix blocking I/O into an async path; use `asyncio.to_thread` for unavoidable blocking calls.
- `httpx` for HTTP.

## Layout

- Follow the framework (FastAPI routers, Django apps). Otherwise `src/<package>/` layout with `tests/` beside `src/`.
- Tests mirror the source tree: `src/app/billing/invoice.py` is tested by `tests/billing/test_invoice.py`.
