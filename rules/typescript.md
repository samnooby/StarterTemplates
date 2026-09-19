---
paths:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.mts"
  - "**/*.cts"
---

# TypeScript rules

## Compiler and tooling

- `strict: true` plus `noUncheckedIndexedAccess`, `noImplicitOverride`, `exactOptionalPropertyTypes` and `noFallthroughCasesInSwitch` in `tsconfig.json`.
- ESLint with `@typescript-eslint` strict-type-checked config. Prettier for formatting. Do not argue with the formatter.
- Use the package manager the repo already uses. For a new project prefer `pnpm`.
- Vitest for tests.

## No escape hatches

- Never `any`. Use `unknown` and narrow.
- Never `as Foo` casts except `as const`. If the type is wrong, fix the source of the type.
- Never `!` non-null assertions. Narrow with a guard or throw a typed error.
- Never `@ts-ignore`, `@ts-expect-error` or `eslint-disable`. If a rule is wrong for the project, change the config with a reason in the commit message.
- Never `enum`. Use `as const` objects with a derived union type.

## Functions

- Top-level and exported functions are named `function` declarations, not arrow functions assigned to `const`.
- Arrow functions are for inline callbacks and short lambdas only.
- Explicit return types on exported functions. Inferred is fine for local helpers and callbacks.
- Prefer plain functions over classes. Use a class only when state and behaviour genuinely belong together and the instance has a lifecycle.
- Prefer `readonly` on arrays, tuples and properties that are never mutated. Default to immutability.

## Types

- `interface` for object shapes that may be extended or implemented. `type` for unions, intersections, mapped and inferred types.
- Discriminated unions over optional-field bags. `{ kind: 'loading' } | { kind: 'ready'; data: T }` not `{ loading: boolean; data?: T }`.
- Derive, do not duplicate: `keyof`, `typeof`, `ReturnType`, `z.infer`.
- Brand primitive IDs when two IDs of the same primitive type could be confused.

## Errors

- One error class per failure a caller could handle, extending `Error`, with a `readonly` field for the identifying value and a `name` matching the class.

```ts
export class UserNotFoundError extends Error {
  readonly name = 'UserNotFoundError';
  constructor(readonly userId: UserId) {
    super(`User ${userId} not found`);
  }
}
```

- Use `instanceof` at the boundary to map errors to responses or exit codes.
- Wrap third-party errors into project errors at the boundary where they enter, preserving the original via `cause`.

## Data and validation

- Zod (or the project's existing schema library). Define the schema, export `type X = z.infer<typeof X>` under the same name.
- Parse at boundaries with `.parse` and let the typed error propagate, or `.safeParse` when the caller must branch on validation failure.
- Environment variables are parsed once at startup into a typed config object. Nothing else reads `process.env`.

## Async

- `async`/`await` everywhere. No raw `.then` chains, no callbacks.
- Run independent awaits concurrently with `Promise.all`.
- Every async boundary (request handler, job, CLI) has exactly one place that catches and maps errors.

## Modules and naming

- ES modules only. Named exports only; no default exports except where a framework requires them (Next.js pages, layouts, routes).
- Identifiers are `camelCase`; types, interfaces, classes and components are `PascalCase`; module-level constants that are true constants are `UPPER_SNAKE_CASE`.
- Files follow the convention already in the repo. For a new repo: `kebab-case.ts` for modules, `PascalCase.tsx` for React components, `*.test.ts` beside the file under test.
- No barrel `index.ts` re-export files except at a published package boundary.
- Import order: node builtins, external packages, internal absolute, relative. Let the linter enforce it.
