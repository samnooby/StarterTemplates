---
name: commit
description: Commit the current changes as one or more small Conventional Commits. Splits unrelated changes into separate commits, never commits a red build, never uses --no-verify.
argument-hint: "[optional scope or hint about what the change is]"
disable-model-invocation: true
---

Commit the current changes. Hint from the user, if any: $ARGUMENTS

## Current state

!`git status --porcelain=v1 2>/dev/null`

!`git diff --stat 2>/dev/null`

## Steps

1. If there is nothing to commit, say so and stop.
2. Read the full diff (`git diff`, `git diff --cached`, and the contents of untracked files). Never commit a file you have not read.
3. Refuse to commit if any of these are true, and say which:
   - The last `/verify` in this conversation was `NOT DONE`, or no verification has run since the last code change and the change touches source code. Run `/verify` first.
   - The diff contains secrets, `.env` files, credentials, or generated artifacts that are not tracked elsewhere in the repo.
   - The diff contains debugging leftovers (`console.log`, `print`, `debugger`, commented-out code).
4. Group the diff into logical changes. Each commit must build and pass tests on its own. Separate refactors from behaviour changes and formatting from everything. A test and the code that makes it pass go together.
5. For each group, stage exactly those files or hunks (`git add -p` when a file mixes groups) and commit with a Conventional Commits message:
   - `<type>(<scope>): <subject>` where type is one of `feat fix refactor test docs chore build ci perf style`.
   - Subject imperative, lower case, no trailing period, at most 72 characters.
   - A body only when the why is not obvious from the diff; wrap at 72; never restate the diff.
   - Use the repo's required attribution trailers if the environment specifies any.
6. Never pass `--no-verify`. If a hook fails, fix the cause and commit again.
7. Never commit on `main` or `master`. If on one, create a `<type>/<short-description>` branch first and tell the user.

## Hand-back

List the commits created, one line each with hash and subject. Mention anything you deliberately left uncommitted and why.
