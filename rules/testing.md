---
paths:
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "**/*.spec.ts"
  - "**/test_*.py"
  - "**/*_test.py"
  - "**/tests/**"
  - "**/__tests__/**"
---

# Testing rules

## Red, green, refactor

1. Write one test that describes the next piece of behaviour in the language of the domain.
2. Run it. Confirm it fails for the right reason (the behaviour is missing, not a typo or import error).
3. Write the smallest implementation that makes it pass.
4. Run the whole affected suite.
5. Refactor with the tests green. Then go back to step 1.

Never write the implementation first and back-fill tests. Never mark a task done with a red test.

## What to test

- Test behaviour through the public interface of the unit. Do not test private functions directly; if a private function is hard to reach, that is a design signal, not a reason to export it.
- One behaviour per test. If the test name needs "and", split it.
- Cover the happy path, each distinct failure path, and the boundaries (empty, one, many, maximum, malformed input).
- Bug fixes start with a test that reproduces the bug.

## Naming

- Test names are full sentences describing behaviour, in plain words, without the word "test" or "should".
  - TypeScript: `it('returns zero for an empty cart')`, grouped by `describe('calculateTotal')`.
  - Python: `def test_returns_zero_for_an_empty_cart() -> None:` grouped in a `class TestCalculateTotal:` when a module has several units.
- Arrange, act, assert with a blank line between the three. No comments labelling them.

## Doubles

- Mock only at true external boundaries: network, clock, filesystem, randomness, third-party SDKs.
- Never mock the module under test's own collaborators to make a test easier. Refactor so the collaborator can be passed in.
- Prefer fakes (an in-memory repository) to mocks with call assertions. Assert on outcomes, not on which functions were called.
- Inject the clock. Never `sleep` in a test.

## Data

- Build test data with small factory functions (`makeUser({ email: 'a@b.c' })`) that supply valid defaults, so each test states only what matters to it.
- No shared mutable fixtures between tests. Each test builds what it needs.

## Tooling

- TypeScript: Vitest. Tests live beside the file under test as `<name>.test.ts`. Testing Library for components.
- Python: pytest. Tests live in `tests/` mirroring `src/`. Use fixtures for expensive setup only.
- Tests run in CI and locally with one command that the project `README` and `CLAUDE.md` name.
