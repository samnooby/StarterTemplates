---
name: new-project
description: Set up a project's Claude Code configuration from Sam's templates. Copies the style rules into .claude/rules/, writes a CLAUDE.md for the detected or named stack (typescript, nextjs, python), and adds a .claude/settings.json with formatting hooks and a sensible permission allowlist. Use in a new or existing repo that has no .claude/ configuration yet.
argument-hint: "[typescript | nextjs | python] (auto-detected if omitted)"
disable-model-invocation: true
---

Set up Claude Code configuration in the current project. Requested stack: $ARGUMENTS

Templates live in `${CLAUDE_PLUGIN_ROOT}/templates/`. Rules live in `${CLAUDE_PLUGIN_ROOT}/rules/`.

## Detect the stack

If no stack was given, detect it:

- `next.config.*` or `next` in `package.json` dependencies: `nextjs`
- otherwise `package.json` with `typescript` in dependencies or a `tsconfig.json`: `typescript`
- `pyproject.toml`, `setup.py` or `requirements*.txt`: `python`
- More than one match: ask the user which to use, or whether to combine (a monorepo may want both a TypeScript and a Python CLAUDE.md section).
- No match: ask the user.

## Steps

1. Check what already exists. If the project already has a `CLAUDE.md` or `.claude/rules/`, show the user what is there and ask before overwriting anything. Merge rather than replace where the user wants both.
2. Create `.claude/rules/` and copy `general.md`, `git.md`, `testing.md` and the language rule files relevant to the stack (`typescript.md` and `react.md` for typescript and nextjs; `python.md` for python). Copy them verbatim; they carry `paths:` frontmatter so they load only for matching files.
3. Copy `templates/<stack>/CLAUDE.md` to the project root as `CLAUDE.md`. Fill in every `<placeholder>` from the real project: package manager, the exact scripts in `package.json` or `pyproject.toml`, the run command, the test command, the source layout. Remove any line about a tool the project does not have, and note it in the hand-back as a gap to fix.
4. Copy `templates/shared/settings.json` to `.claude/settings.json`, and `${CLAUDE_PLUGIN_ROOT}/hooks/scripts/guard-bash.sh` and `format-file.sh` to `.claude/hooks/`. Make the scripts executable. Trim the permission allowlist in `settings.json` to the package manager the project actually uses.
5. If the project has no formatter or linter config for its stack, offer to add the default from `templates/<stack>/` (`.prettierrc`, `eslint.config.js`, `tsconfig.json` additions, or `ruff` and `pyright` sections in `pyproject.toml`). Do not add them without asking.
6. Add `CLAUDE.local.md` to `.gitignore` if it is not already ignored.
7. Seed a `harness.spec.json` at the project root from the matching example in `${CLAUDE_PLUGIN_ROOT}/examples/` (`http-express`, `web-vite`, `cli-python`, `mobile-expo`), trimmed to a health check or a first-screen load that is true for this project. The `run-app` skill uses it as the smoke suite.

## Hand-back

List the files created or modified. Name every placeholder you could not fill from the project and what the user should set it to. Suggest committing as `chore: add claude code configuration`.
