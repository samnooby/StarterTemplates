---
name: test-cli
description: Exercise a command-line program end to end. Runs commands with arguments and stdin from a JSON spec and asserts exit code, stdout and stderr. Use for Python or Node CLIs, scripts and one-shot tools.
argument-hint: "[project dir] [what to exercise]"
---

Exercise the CLI in `$0` (default: the current project): $ARGUMENTS

## Command

```
cd "${CLAUDE_PLUGIN_ROOT}/harness" && pnpm -s cli <absolute path to spec.json>
```

No server, so no `with-app.sh`. Exit code 0 means every case matched; 1 means at least one did not.

## Spec format

```json
{
  "cwd": ".",
  "cases": [
    { "name": "greets by name", "command": ["uv", "run", "greet", "Sam"], "expect": { "stdout": "Hello, Sam!\n" } },
    { "name": "reads stdin", "command": ["uv", "run", "greet", "-"], "stdin": "Sam\n", "expect": { "stdoutIncludes": "Sam" } },
    { "name": "rejects empty name", "command": ["uv", "run", "greet", ""], "expect": { "exitCode": 2, "stderrIncludes": "name" } },
    { "name": "respects env", "command": ["node", "dist/cli.js"], "env": { "NO_COLOR": "1" }, "timeoutMs": 5000, "expect": { "exitCode": 0 } }
  ]
}
```

- `cwd` is relative to the spec file. `command` is an argv array, never a shell string, so quoting is never a problem.
- `expect.exitCode` defaults to 0. `expect.stdout` is exact. `expect.stdoutIncludes` and `expect.stderrIncludes` are substrings.
- A case that exceeds `timeoutMs` (default 30 seconds) is killed and reported as timed out. A command that cannot be found reports `exit null`.

## Writing a good spec

- One case per behaviour changed, plus the failure path with its exit code and error message.
- Assert exact stdout for machine-readable output (JSON, tables) and a substring for human-readable output.
- Include `--help` in the project's `harness.spec.json` so a broken argument parser is caught immediately.
