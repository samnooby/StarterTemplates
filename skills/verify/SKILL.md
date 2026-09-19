---
name: verify
description: Prove a change is done. Runs typecheck, lint and tests, starts the app and exercises the change, then re-reads the diff. Use before saying any change is complete and before committing.
disable-model-invocation: true
---

Verify the current change is done.

## Steps

1. Delegate to the `verifier` agent. Tell it what behaviour changed and how it should be exercised (which endpoint, command, page or script) so it can run the app meaningfully. If the conversation contains an approved plan, pass its "Verification" section.
2. Relay the report: the `DONE` / `NOT DONE` line, the per-check table, and the trimmed output for any failure or finding.
3. If `NOT DONE`: fix the reported problems in order, then run `/verify` again. Do not report the change as complete until the verifier says `DONE`.
4. If `DONE`: tell the user in a short message with reasoning what changed, what was verified and anything they should check themselves. Then offer `/commit`.
