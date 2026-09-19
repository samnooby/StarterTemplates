---
name: tdd
description: Red-green-refactor loop for one behaviour. Writes the failing test first via the test-writer agent, then implements the smallest change to pass, then refactors with tests green. Use for every new behaviour and every bug fix.
argument-hint: "[behaviour to implement or bug to fix]"
disable-model-invocation: true
---

Implement the following behaviour test-first:

$ARGUMENTS

If no behaviour was given above, use the next unimplemented item from the approved plan in this conversation. If there is no approved plan and the change is non-trivial, run `/plan` first.

## Red

1. Delegate to the `test-writer` agent with the behaviour, the target module if known, and the interface from the plan if there is one. It writes only test files and confirms they fail for the right reason.
2. Read its hand-back. If a test fails for the wrong reason (import error, typo, fixture problem), send it back to the test-writer. If a test already passes, the behaviour exists; tell the user and stop.

## Green

3. Write the smallest implementation that makes the new tests pass. Follow the interface the tests assume. Follow the `coding-style` rules: named function declarations, strict types with no escape hatches, typed errors, schema-first data, no comments.
4. Run the new tests, then the whole affected suite. Both must be green before moving on.

## Refactor

5. With everything green, re-read the implementation and the tests. Remove duplication, improve names, simplify structure. Re-run the suite after each refactor.
6. Do not add behaviour during refactor. New behaviour is the next `/tdd` cycle.

## Hand-back

Report in a few lines: the tests added, the files changed, the command that runs them, and the passing output trimmed to the summary line. If you made a design decision the tests did not force, say why in one sentence.
