---
name: test-web
description: Exercise a website or web app in a real browser. Starts the dev server, drives Chromium through a JSON spec of steps (goto, click, fill, expect text, screenshot), fails on console errors and failed requests, stops the server. Use for Vite, Next.js, static sites and Expo web changes.
argument-hint: "[project dir] [what to exercise]"
---

Exercise the web UI in `$0` (default: the current project): $ARGUMENTS

## Command

```
bash "${CLAUDE_PLUGIN_ROOT}/harness/with-app.sh" \
  --cwd <project dir> --port <port> --timeout 90 \
  --start "<start command>" \
  --check "cd '${CLAUDE_PLUGIN_ROOT}/harness' && pnpm -s web <absolute path to spec.json>"
```

Chromium must be installed once: `cd "${CLAUDE_PLUGIN_ROOT}/harness" && pnpm exec playwright install chromium`. If a preinstalled browser must be used instead, set `PLAYWRIGHT_CHROMIUM_PATH` to its executable.

## Spec format

```json
{
  "baseUrl": "http://127.0.0.1:5173",
  "viewport": { "width": 1280, "height": 800 },
  "stepTimeoutMs": 10000,
  "allowConsoleErrors": ["favicon.ico"],
  "allowFailedRequests": ["/analytics"],
  "outDir": "out/my-app",
  "steps": [
    { "goto": "/" },
    { "expectTitle": "Counter" },
    { "expectText": "Count: 0" },
    { "click": { "role": "button", "name": "Increment" } },
    { "fill": { "label": "Name", "value": "Sam" } },
    { "press": "Enter" },
    { "expectVisible": { "testId": "greeting" } },
    { "expectNoText": "Error" },
    { "expectUrl": "/done" },
    { "screenshot": "after-submit" },
    { "wait": 500 }
  ]
}
```

- Targets are `{ "role", "name" }`, `{ "label" }`, `{ "text" }`, `{ "testId" }` or `{ "selector" }`. Prefer role and name, then label, then text. Use a selector only when nothing accessible exists, and say so.
- Steps run in order and stop at the first failure. A failure saves `failure-step-N.png` in `outDir` and the report prints its path.
- Every console error, page error, failed request and 4xx or 5xx response fails the run unless it matches an `allow*` substring. Do not add allow entries to make a run pass; fix the cause or explain why it is expected.
- `outDir` is relative to the harness directory. Screenshots go there; look at them with the Read tool when a step fails or when the change is visual.

## Writing a good spec

- Start with the page the change is on, assert the state before the interaction, perform it, assert the state after.
- Assert what a user would see, not internal state.
- Take one screenshot at the end of a visual change and look at it before declaring the change done.
- Keep the project's `harness.spec.json` as the smoke journey through the main screen.
