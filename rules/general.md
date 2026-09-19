# General coding rules

These rules apply to every file in every language. Language-specific rules live next to this file and take precedence where they overlap.

## Names carry the meaning

- Function, variable, type, module and file names do the explaining. If a name needs a comment to be understood, rename it.
- Name things for what they are or do, not how they are implemented: `activeSubscriptions`, not `filteredList`; `retryWithBackoff`, not `helper2`.
- Booleans read as predicates: `isExpired`, `hasPermission`, `canRetry`.
- Functions that return something are nouns or noun phrases for the result (`userById`, `totalPrice`); functions that do something are verbs (`sendInvoice`, `persistOrder`).
- Avoid abbreviations unless universal (`id`, `url`, `http`). No single-letter names outside tiny lambdas and loop indices.

## No comments, with two exceptions

- Do not write comments that describe what the code does. The code already says that.
- Do not write section-header comments, TODO markers left for later, or commented-out code.
- Do not add JSDoc, docstrings or type-narration on functions. Types and names are the documentation.
- Exception one: a short comment explaining a non-obvious *why* that cannot be expressed in code (a workaround for a specific upstream bug, a regulatory constraint, an ordering requirement). Link the source when there is one.
- Exception two: a module or package needs one when it is a public library boundary consumed by people who never read the source.

## Readability decides size

- There is no line-count target for functions or files.
- A function that reads top to bottom as a linear story is better than a dozen tiny functions the reader has to jump between.
- Extract a function when the extracted piece has a real name that hides irrelevant detail, or when it is reused. Do not extract to satisfy a metric.
- Keep the happy path unindented: return or throw early for guard conditions.
- Order code so a reader meets the high-level function before the details it calls.

## Strict types, no escape hatches

- Every project runs its type checker in strict mode and the build fails on type errors.
- Never silence the checker (`any`, `as` casts, non-null assertions, `type: ignore`, `eslint-disable`). Fix the type or narrow the value properly.
- The only allowed casts are `as const` and const assertions.
- Data crossing a boundary (HTTP, environment, filesystem, database driver, third-party SDK) is `unknown` until parsed through a schema.

## Errors are thrown, typed and handled at boundaries

- Model failures as typed error classes extending the language base error, one class per distinct failure a caller could reasonably handle.
- Throw at the point of detection. Catch only at boundaries: request handlers, CLI entry points, job runners, UI error boundaries.
- Never swallow an error. Never `catch` and log and continue unless the operation is explicitly best-effort and the name says so.
- Error messages state what was expected and what was found, and include the identifying value.

## Schema first

- Define the schema, infer the type from it. Do not hand-write a type and separately validate it.
- Parse at the edge, then trust the type inside.

## Dependencies

- Well-known, actively maintained libraries are fine to add without asking (validation, dates, HTTP clients, test runners).
- Ask before adding anything niche, anything that pulls a large transitive tree, or anything that duplicates a capability already in the project.
- Match the package manager and lockfile already in use. Never mix.

## Project layout

- Follow the framework's conventions (Next.js app router, FastAPI, Vite). Do not invent a parallel layer structure.
- Where the framework is silent, group by feature, not by file type.
- Match existing conventions in the repo before applying these defaults.

## Workflow

- Plan before code. For anything beyond a trivial change, present a short plan and wait for approval before editing.
- Tests come first. Write the failing test that describes the behaviour, watch it fail, then implement.
- A change is done only when: the type checker and linter pass, the tests pass, the app has been run and the change exercised, and the diff has been re-read for bugs and leftovers.
- Report results short and with reasoning: what changed, why any non-obvious decision was made, what to check, what is blocked. No file-by-file walkthroughs.
