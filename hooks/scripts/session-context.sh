#!/usr/bin/env bash
set -euo pipefail

if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'detached')"
  dirty="$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')"
  printf 'Git: branch %s, %s uncommitted change(s).\n' "$branch" "$dirty"
  case "$branch" in
    main|master) printf 'You are on the default branch. Create a <type>/<description> branch before committing.\n' ;;
  esac
  printf '\n'
fi

cat <<'SUMMARY'
Sam's coding style (compact). Run /coding-style for the full rules.

Workflow
- Plan first for anything non-trivial: /plan, then wait for approval before editing.
- Tests first: /tdd writes the failing test, then the smallest implementation, then refactor.
- Done means: typecheck + lint pass, tests pass, the app was run and the change exercised, the diff was re-read. /verify proves it.
- Commits are small Conventional Commits (/commit). PRs only when asked (/pr). Never --no-verify, never force-push main.
- Reports: short, outcome first, one sentence of reasoning for non-obvious decisions. No file-by-file walkthroughs.

Code
- Names carry the meaning. No comments except a rare non-obvious "why". No docstrings/JSDoc narration, no section headers, no TODOs.
- Size by readability, not line count. A linear function beats fragments. Extract only when the piece has a real name or is reused.
- Strict types, zero escape hatches: no any/as/!/ts-ignore/eslint-disable/type: ignore/cast/Any. `as const` only.
- Failures are typed error classes, thrown at detection, caught only at boundaries. Never swallowed.
- Schema first (zod / pydantic): define the schema, infer the type, parse at the edge, trust inside.
- Follow the framework's layout conventions; otherwise group by feature. Match the repo's existing conventions.
- Dependencies: well-known maintained libs are fine; ask before anything niche. Never mix package managers.

TypeScript / React
- Named `function` declarations at top level; arrows only for inline callbacks. Named exports; no default exports unless the framework requires.
- No enum (use `as const` objects). Discriminated unions over optional-flag bags. readonly by default.
- React: `interface XProps` + `function X({ ... }: XProps)`, logic in `useX` hooks, CSS Modules, no inline styles, no Tailwind unless present.
- pnpm, Vitest, Prettier, typescript-eslint strict-type-checked.

Python
- uv, ruff (lint + format), pyright strict, pytest, 3.12+ syntax.
- frozen slots dataclasses internally, pydantic at boundaries, pathlib, tz-aware datetimes, keyword-only args past two params.
- Project base exception with one subclass per handleable failure. No bare except outside main/handlers.
SUMMARY
