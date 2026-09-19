# StarterTemplates

This repo is a Claude Code plugin (`sam-workflow`) plus copyable project templates. There is no application code. Everything here is Markdown, JSON and Bash that configures Claude Code.

## Commands

- Validate JSON: `for f in .claude-plugin/*.json hooks/hooks.json templates/shared/settings.json; do jq empty "$f"; done`
- Check shell: `bash -n hooks/scripts/*.sh scripts/*.sh` and `shellcheck hooks/scripts/*.sh scripts/*.sh` when available
- Exercise the guard: `printf '{"tool_input":{"command":"git push -f origin main"}}' | bash hooks/scripts/guard-bash.sh; echo "exit $?"` must print exit 2
- Render the rules: `bash scripts/print-rules.sh | head`
- Harness: `cd harness && pnpm install && pnpm typecheck`, then run each example's spec as described in `README.md`. Every example must pass its own typecheck, lint, format check and tests, and its harness spec, before a change to `harness/` or `examples/` is done.
- Each example's `CLAUDE.md` names its commands.

## Layout

- `rules/` is the single source of truth for coding style. Each file has `paths:` frontmatter except `general.md` and `git.md`, which apply everywhere.
- `hooks/scripts/session-context.sh` holds a compact summary of the rules. Keep it in sync when a headline rule changes; keep it short because it loads every session.
- `agents/*.md`, `skills/*/SKILL.md` and hooks reference `${CLAUDE_PLUGIN_ROOT}` for plugin files, never a hard-coded path.
- `templates/` is what `/new-project` copies into other repos. Placeholders are written as `<placeholder>`.
- `harness/` drivers share `report.ts`; spec formats are documented in the matching `skills/test-*/SKILL.md` and must stay in sync with the zod schemas in the drivers.
- `examples/` are written to the rules in `rules/` and are the reference for what the style looks like in practice. `examples/mobile-expo` pins dependencies from Expo's bundled version table; change them with `expo install`, not by hand.

## Conventions for this repo

- Agent descriptions are written for the delegation matcher: say when to use the agent and what it must not do.
- Skills that drive a workflow set `disable-model-invocation: true` so they only run when Sam types the slash command. `coding-style` is the exception; Claude may load it on its own.
- Rules are written as imperatives with a concrete example where the rule is easy to misread. No hedging.
- Bump `version` in both `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json` together when behaviour changes.
- Conventional Commits, one logical change per commit.
