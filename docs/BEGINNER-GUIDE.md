# Beginner Guide: Agentic Project Flow in Pi

This guide assumes you have never used Pi project-flow, WorkGraph, beads, git/tests, or the grill skills.

## The idea in one sentence

Use AI agents like a disciplined engineering team:

```text
clarify intent -> stress-test decisions -> plan -> create tasks -> execute -> verify -> commit -> hand off
```

The tools divide responsibilities:

| Component | What it is | Job |
|---|---|---|
| Pi | Terminal coding agent harness | Lets the agent read files, run commands, edit code, and use extensions/skills/prompts. |
| pi-project-flow | Workflow package | Adds commands for spec, plan, tasks, execution, review, and handoff. |
| pi-workgraph | Execution engine | Runs persistent multi-step/multi-agent plans with status and logs. |
| beads (`bd`) | Git-backed issue/task graph | Durable task memory: ready/blocked/in-progress/done issues. |
| git | Version control | Durable code history, rollback, collaboration, and proof of changes. |
| tests/verify script | Pass/fail signal | Lets the agent prove work is correct. |
| grill-me | Design interrogation skill | Stress-tests your plan by asking one question at a time. |
| grill-with-docs | Domain-aware interrogation skill | Stress-tests against `CONTEXT.md`/ADRs and updates docs as decisions crystallize. |

## Mental model

Do not use chat history as project memory. Chat is temporary. The repo is memory.

Durable memory lives in:

```text
CONTEXT.md                  domain terms/glossary
docs/adr/                   architecture decisions
docs/specs/<feature>/       spec, plan, handoff
a beads task graph          work items and dependencies
git commits                 exact code changes and checkpoints
tests and scripts/verify.*  proof the system still works
.pi/workgraph/              execution plans and logs
```

## When to use each command

```text
/pf-init       first setup in a repo
/pf-spec       turn an idea into a clear spec
/pf-grill      stress-test the spec/plan by interview
/pf-grill-docs stress-test while updating CONTEXT.md/ADRs
/pf-plan       make a technical plan
/pf-tasks      create beads issues from spec+plan
/pf-execute    implement one ready slice
/pf-review     review current changes
/pf-handoff    leave notes for the next session
/pf-status     see current project state
```

Prompt-template versions also exist:

```text
/flow-spec /flow-grill /flow-grill-docs /flow-plan /flow-tasks /flow-execute /flow-review /flow-handoff
```

The `/pf-*` commands are extension commands that immediately send a prepared prompt. The `/flow-*` commands are prompt templates you can edit before sending.

## Recommended first session

From a project directory:

```text
/pf-init --beads
```

This creates:

```text
AGENTS.md
CONTEXT.md
docs/adr/
docs/specs/
scripts/
```

Then describe your idea:

```text
/pf-spec add Google OAuth login
```

If the idea is important or ambiguous, grill it:

```text
/pf-grill-docs oauth-login
```

Then plan:

```text
/pf-plan oauth-login
```

Grill again if architecture is risky:

```text
/pf-grill-docs oauth-login plan
```

Create tasks:

```text
/pf-tasks oauth-login
```

Execute one slice:

```text
/pf-execute
```

Review and hand off:

```text
/pf-review
/pf-handoff oauth-login
```

## What “done” means

A task is not done because the agent says it is done. A task is done when there is evidence:

- tests passed;
- build/typecheck/lint passed;
- browser automation verified the UI;
- API/curl check verified behavior;
- acceptance criteria were checked with concrete observations.

Good final answer from an agent:

```text
Completed bd-123.
Changed: src/auth/callback.ts, tests/auth/callback.test.ts
Verification: pnpm test auth passed, pnpm typecheck passed
Commit: abc1234 Implement OAuth callback validation (bd-123)
```

Bad final answer:

```text
Done, should work now.
```

## What to do when stuck

- Use `/pf-status` to see state.
- Use `/pf-handoff` before resetting context.
- Use `bd ready --json` to find what can be worked next.
- Use WorkGraph logs if a sub-agent is slow or failed.
- Use `git status` and `git log --oneline -10` to recover recent changes.
- Grill the plan if the agent keeps implementing the wrong thing.
