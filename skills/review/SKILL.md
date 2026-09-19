---
name: review
description: Review the current uncommitted changes (or a given commit range, branch, PR or path) for bugs and style violations using the code-reviewer agent. Reports findings only; does not edit.
argument-hint: "[commit range | branch | PR number | path] (defaults to working tree)"
disable-model-invocation: true
---

Review this target: $ARGUMENTS

If no target was given, review the uncommitted working tree (staged, unstaged and untracked files).

## Steps

1. Delegate to the `code-reviewer` agent with the target. Include the project's `CLAUDE.md` path if one exists so it can apply project-specific rules over the defaults.
2. Relay its report to the user as-is: verdict line, findings most severe first with `path:line` and a concrete fix, nits grouped at the end.
3. Do not fix anything. If the user wants the findings applied, they will say so; then fix them in order of severity, re-running the affected tests after each, and finish with `/verify`.
