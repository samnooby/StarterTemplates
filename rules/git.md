# Git rules

## Commits

- Conventional Commits: `<type>(<optional scope>): <subject>`.
- Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `build`, `ci`, `perf`, `style`.
- Subject is imperative, lower case, no trailing period, at most 72 characters: `feat(auth): add magic-link sign in`.
- Body only when the *why* is not obvious from the diff. Wrap at 72. Never restate the diff.
- Use `!` after the type for a breaking change and explain it in the body.

## Small commits

- One logical change per commit. A commit should be revertable on its own without breaking the build.
- Separate refactors from behaviour changes. Separate formatting-only changes from everything.
- A test and the code that makes it pass belong in the same commit. A failing test alone is never committed.
- Do not bundle unrelated fixes discovered along the way. Commit them separately or leave them for a follow-up.

## Branches

- Short-lived feature branches off the default branch, named `<type>/<short-kebab-description>`: `feat/magic-link-sign-in`.
- Never commit directly to `main` or `master`.
- Rebase onto the default branch before opening a PR. Never rewrite history on a branch someone else has pulled.

## Never

- `--no-verify`. If a hook fails, fix what it is complaining about.
- Force-push to `main` or `master`.
- Commit secrets, `.env` files, or generated artifacts that are not meant to be tracked.
- Commit with a failing type check, lint or test.

## Pull requests

- Title follows the same Conventional Commits format as a squash commit would.
- Body: what and why in two or three sentences, how it was verified, anything the reviewer should look at first.
- Keep PRs small enough to review in one sitting. Split when a PR does two things.
