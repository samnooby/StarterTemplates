---
name: test-mobile
description: Exercise an Expo (React Native) app in three layers, using whichever are available: component tests with Testing Library, the web build driven in Chromium, and Maestro flows on a simulator or emulator. Reports which layers ran. Use for any React Native or Expo change.
argument-hint: "[project dir] [what to exercise]"
---

Exercise the Expo app in `$0` (default: the current project): $ARGUMENTS

Three layers, from cheapest to most faithful. Run every layer that is available and say plainly which ones ran and which could not.

## Layer 1: component tests (always available)

`jest-expo` with `@testing-library/react-native`. Query by role and accessible name (`getByRole('button', { name: 'Increment' })`) or by text. Run the project's test command (`pnpm test`). This proves logic and rendering, not layout or navigation on a device.

## Layer 2: web build in Chromium (available wherever Chromium runs)

Expo renders the same components through `react-native-web`. Drive it with the `test-web` driver:

```
bash "${CLAUDE_PLUGIN_ROOT}/harness/with-app.sh" \
  --cwd <project dir> --port 8081 --timeout 240 \
  --start "CI=1 EXPO_OFFLINE=1 pnpm web" \
  --check "cd '${CLAUDE_PLUGIN_ROOT}/harness' && pnpm -s web <absolute path to harness.spec.json>"
```

`CI=1` keeps the Expo CLI non-interactive and `EXPO_OFFLINE=1` skips its network calls (dependency validation, update checks), which otherwise abort the start on a machine without access to the Expo API. First bundle can take a couple of minutes, hence the long timeout. `Pressable` with `accessibilityRole="button"` and `accessibilityLabel` becomes a real button with a name on web, so `{ "role": "button", "name": "Increment" }` targets work. Native-only modules (camera, haptics, push) will not run here; assert around them or stub them for web.

## Layer 3: Maestro on a device (only on a machine with a simulator or emulator)

Flows live in `maestro/*.yaml`. Run with `maestro test maestro/` while a simulator or emulator is booted and the app is installed (`pnpm ios` or `pnpm android` first). Check availability with `command -v maestro` and `xcrun simctl list devices booted` or `adb devices`. If none is available, say so and do not claim the flow ran.

Flow shape:

```yaml
appId: com.example.counter
---
- launchApp
- assertVisible: "Count: 0"
- tapOn: "Increment"
- assertVisible: "Count: 1"
```

`tapOn` and `assertVisible` match accessibility labels and visible text. Give every interactive element an `accessibilityLabel` so flows stay stable when copy changes.

## Report

State each layer as `ran: pass`, `ran: fail` with the output, or `unavailable: reason`. A change to navigation, gestures, native modules or platform-specific layout is not verified until layer 3 has run; say that explicitly rather than implying the web run covers it.
