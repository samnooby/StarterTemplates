---
name: pr
description: Open a pull request for the current branch with a Conventional Commits title and a short what/why/verification body, using the pr-creator agent. Use only when asked for a PR.
argument-hint: "[optional base branch or extra context for the description]"
disable-model-invocation: true
---

Open a pull request for the current branch. Extra context from the user, if any: $ARGUMENTS

## Steps

1. If the working tree has uncommitted changes, stop and tell the user to run `/commit` first.
2. Delegate to the `pr-creator` agent with the base branch if the user named one and any context above. It will read the commits and diff, find a PR template, push the branch if needed, and open or update the PR.
3. Relay the PR URL and title, plus any note it returned (draft status, template sections it could not fill, an existing PR it updated instead).
4. Offer once to watch the PR for CI failures and review comments if that capability exists in this environment.
