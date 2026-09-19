---
paths:
  - "**/*.tsx"
  - "**/*.jsx"
---

# React rules

## Components

- Every component is a named `function` declaration with a `Props` interface named `<Component>Props` declared directly above it.
- Destructure props in the signature.
- Components are mostly markup. State, effects, data fetching and derived values live in custom hooks named `use<Thing>` in their own file beside the component.
- One component per file. The file is `PascalCase.tsx` and matches the component name.
- Small presentational children can live in the same file below the parent when they are not reused elsewhere.
- No default exports unless the framework requires it (Next.js `page.tsx`, `layout.tsx`, `route.ts`).

```tsx
interface UserCardProps {
  userId: UserId;
  onSelect?: (userId: UserId) => void;
}

export function UserCard({ userId, onSelect }: UserCardProps) {
  const { user, status } = useUser(userId);
  if (status === 'loading') return <Spinner />;
  if (status === 'error') return <ErrorNotice />;
  return (
    <button className={styles.card} onClick={() => onSelect?.(userId)}>
      {user.name}
    </button>
  );
}
```

## Hooks

- A hook owns one concern. `useUser` fetches a user; it does not also handle form state.
- Return an object, not a tuple, when a hook returns more than two values.
- Model async state as a discriminated union (`idle | loading | ready | error`), never as parallel `isLoading` and `error` flags.
- Prefer a data library already in the project (TanStack Query, SWR, server components) over hand-rolled `useEffect` fetching.
- `useEffect` is for synchronising with something outside React. If an effect only computes derived state, compute it inline or with `useMemo`.

## Next.js

- App router. Fetch data in server components and pass it down. Push interactivity into the smallest client component that needs it, marked `'use client'`.
- Server actions and route handlers parse their input with a schema before doing anything.
- Follow the framework's file conventions exactly; do not add a parallel `pages/` or `components/` hierarchy that fights the router.

## Styling

- CSS Modules. `<Component>.module.css` beside the component, imported as `styles`.
- Class names in the module are `camelCase` so they are valid property accesses.
- No inline `style` props except for genuinely dynamic values (a computed width, a user-chosen colour), and then via CSS custom properties.
- No Tailwind or CSS-in-JS unless the project already uses it.
- Use design tokens (CSS custom properties on `:root`) for colours, spacing and type. Never hard-code a colour in a component stylesheet.

## Accessibility and semantics

- Use the semantic element (`button`, `nav`, `ul`, `label`) before reaching for `div` plus ARIA.
- Every interactive element is keyboard reachable and has an accessible name.
- Every form control has a linked `label`.

## Testing components

- Testing Library with Vitest. Query by role and accessible name, never by class or test ID unless there is no accessible alternative.
- Test behaviour a user would notice, not internal state.
