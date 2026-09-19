---
name: run-app
description: Detect what kind of app the current project is (http server, website, cli, expo mobile) and run the matching harness to exercise it end to end. Use whenever a change needs to be seen working in the real app, including as the "run the app" step of verification.
argument-hint: "[path to project] [what to exercise]"
disable-model-invocation: false
---

Run the app in `$0` (default: the current project) and exercise: $ARGUMENTS

Harness scripts live in `${CLAUDE_PLUGIN_ROOT}/harness/`. Install its dependencies once per machine:

```
cd "${CLAUDE_PLUGIN_ROOT}/harness" && pnpm install && pnpm exec playwright install chromium
```

## Steps

1. Detect the app type and start command:

   ```
   bash "${CLAUDE_PLUGIN_ROOT}/harness/detect-app.sh" <project dir>
   ```

   It prints `harness=`, `start=` and `port=`. If it prints `unknown`, read the project's `CLAUDE.md`, `package.json` scripts and `pyproject.toml` and decide yourself. If the project's `CLAUDE.md` names a harness or a run command, that wins.

2. Follow the matching skill: `test-http`, `test-web`, `test-cli` or `test-mobile`. Each explains the spec format and the exact command.

3. If the project already has a `harness.spec.json`, run it first. Then write a spec that exercises the specific behaviour that changed, in a temp file if it is one-off or beside the existing spec if it is worth keeping.

4. Report the driver's output as-is: the pass or fail table and, for failures, the detail line and the screenshot path. Never summarise a failure as "should work".

## Ports

Every driver is run through `with-app.sh`, which refuses to start if the port is already in use and always kills the app when the check finishes. If a port is busy, find the process (`lsof -i :PORT` or `ss -ltnp`) and report it rather than picking a different port silently.
