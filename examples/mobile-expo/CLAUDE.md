# example-mobile-expo

Minimal Expo (React Native) app used to exercise the `test-mobile` harness. Also a starting point for a new mobile app.

## Commands

- Install: `pnpm install` (uses `node-linker=hoisted`, which Expo needs under pnpm)
- Run on web: `pnpm web` (port 8081); on a simulator: `pnpm ios` or `pnpm android`
- Typecheck: `pnpm typecheck`
- Lint: `pnpm lint` and `pnpm format:check`
- Component tests: `pnpm test` (jest-expo + Testing Library)
- Web harness: from the plugin root, `harness/with-app.sh --cwd examples/mobile-expo --port 8081 --timeout 180 --start "CI=1 EXPO_OFFLINE=1 pnpm web" --check "cd ../../harness && pnpm -s web ../examples/mobile-expo/harness.spec.json"`
- Device flow: `pnpm maestro` with a simulator or emulator running (untested here; needs Maestro installed)

## Layout

- `App.tsx` is the root; `index.ts` registers it.
- `src/Counter/` holds the component, its hook and its test together.
- `src/theme.ts` holds colour, spacing and radius tokens. Never hard-code a colour in a component.
- `maestro/` holds device flows, one YAML per user journey.

## Dependencies

Expo pins the React and React Native versions per SDK. Change them only with `npx expo install <package>`, never by editing `package.json` by hand.
