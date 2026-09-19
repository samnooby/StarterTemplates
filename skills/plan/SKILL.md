---
name: plan
description: Produce an implementation plan for a task and stop for approval before writing any code. Use for any change beyond a one-line fix.
argument-hint: "[what to build or change]"
disable-model-invocation: true
---

Plan the following task and wait for approval before touching any code:

$ARGUMENTS

If no task was given above, plan the most recent request in the conversation.

## Steps

1. Delegate to the `planner` agent with the task text and any relevant context from the conversation (files already discussed, constraints the user stated). Let it explore the codebase and return the plan.
2. Relay the plan to the user verbatim in its sections (Goal, Approach, Tests first, Changes, Verification, Risks and open questions). Do not summarise it away.
3. Stop. Do not create, edit or delete any file until the user replies with approval or changes. "Looks good", "go", "approved" or similar is approval. Anything else is a revision request: update the plan and stop again.

## After approval

Work the plan in this order: `/tdd` for each behaviour in "Tests first", implement to green, then `/verify`. Do not skip to implementation.
