# StarterTemplates

Sam's Claude Code setup: coding style rules, a plan-first TDD workflow, specialist agents, guard and formatting hooks, and per-stack `CLAUDE.md` templates. The repo is both a Claude Code plugin and a set of copyable templates.

## Install the plugin

Inside Claude Code:

```
/plugin marketplace add samnooby/StarterTemplates
/plugin install sam-workflow@samnooby
```

Once installed, every session gets:

| Kind | Name | What it does |
| --- | --- | --- |
| Skill | `/plan` | Planner agent writes an implementation plan and stops for approval |
| Skill | `/tdd` | Red, green, refactor for one behaviour via the test-writer agent |
| Skill | `/review` | Code-reviewer agent reports bugs and style violations, does not edit |
| Skill | `/verify` | Verifier agent runs typecheck, lint, tests, boots the app, re-reads the diff |
| Skill | `/commit` | Small Conventional Commits, refuses red builds and `--no-verify` |
| Skill | `/pr` | PR-creator agent opens a PR with a conventional title and short body |
| Skill | `/coding-style` | Loads the full style rules on demand |
| Skill | `/new-project` | Copies rules, `CLAUDE.md` and settings into a project |
| Agent | `planner`, `test-writer`, `code-reviewer`, `verifier`, `pr-creator` | Also delegated to automatically when a task matches |
| Hook | SessionStart | Prints git state and a compact style summary |
| Hook | PreToolUse Bash | Blocks `--no-verify`, force-push to main/master, `rm -rf` of home/root/cwd, committing on main |
| Hook | PostToolUse Edit/Write | Runs Prettier or Ruff on the changed file when the project has them |
| Hook | Stop | Refuses to declare a code change done without reported verification |

## Set up a project

In a repo with no `.claude/` yet:

```
/new-project            # detects typescript, nextjs or python
/new-project python     # or name the stack
```

This copies `rules/` into `.claude/rules/` (path-scoped, so TypeScript rules load only for `.ts` files), writes a `CLAUDE.md` from `templates/<stack>/` with the project's real commands filled in, and adds `.claude/settings.json` with the guard and format hooks and a permission allowlist.

Or copy by hand:

```
mkdir -p .claude/rules .claude/hooks
cp path/to/StarterTemplates/rules/{general,git,testing,typescript,react}.md .claude/rules/
cp path/to/StarterTemplates/templates/typescript/CLAUDE.md CLAUDE.md
cp path/to/StarterTemplates/templates/shared/settings.json .claude/settings.json
cp path/to/StarterTemplates/hooks/scripts/{guard-bash,format-file}.sh .claude/hooks/
```

## Layout

```
.claude-plugin/     plugin.json and marketplace.json
agents/             one .md per agent: frontmatter + system prompt
skills/<name>/      SKILL.md per slash command
hooks/              hooks.json and the scripts it runs
rules/              the canonical style rules (general, typescript, react, python, testing, git)
scripts/            helpers used by skills
templates/          per-stack CLAUDE.md and tooling config, shared settings.json
```

`rules/` is the single source of truth. The plugin reads it at runtime (`/coding-style`, the agents), the session-start hook carries a hand-maintained compact summary of it, and `/new-project` copies it into projects. When a rule changes, update the rule file and, if it is one of the headline rules, the summary in `hooks/scripts/session-context.sh`.

## The style in one paragraph

Names carry the meaning and there are no comments except a rare non-obvious why. Size is decided by readability, not line count. Types are strict with zero escape hatches. Failures are typed errors thrown at detection and caught at boundaries. Data is schema-first with inferred types. Layout follows the framework. Work is planned and approved first, written test-first, verified by running the type checker, linter, tests and the app, and committed in small Conventional Commits.
