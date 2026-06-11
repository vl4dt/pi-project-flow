---
name: project-flow
description: Spec-first, beads-backed, WorkGraph-executed workflow for agentic coding projects. Use when creating specs/plans/tasks, executing issues, reviewing changes, or preparing handoff/progress notes.
---

# Project Flow

Use this workflow for non-trivial coding work. The goal is durable project memory plus verifiable execution.

## Golden path

1. **Status**: call `project_flow_status` when available; otherwise inspect `git status`, `bd ready --json`, `.pi/workgraph/plans/`, `CONTEXT.md`, `docs/adr/`, and `docs/specs/`.
2. **Spec**: capture intent in `docs/specs/<feature>/spec.md`.
3. **Grill intent**: use `grill-me` for conceptual stress-testing, or `grill-with-docs` when domain language/ADRs should be updated.
4. **Plan**: capture architecture and constraints in `docs/specs/<feature>/plan.md`.
5. **Grill design**: challenge the plan before creating tasks, especially for irreversible architecture or domain decisions.
6. **Tasks**: create durable beads issues with dependencies and acceptance criteria.
7. **Execute**: work one independently verifiable slice at a time. Use WorkGraph for multi-step/multi-agent waves.
8. **Verify**: run focused tests plus `scripts/verify.ps1` or `scripts/verify.sh` when present.
9. **Commit**: commit clean increments with the beads issue ID.
10. **Handoff**: update beads and write compact progress notes before stopping.

## Spec format

`docs/specs/<feature>/spec.md` should include:

- Problem / opportunity
- Users / actors
- Goals
- Non-goals
- Requirements
- Acceptance criteria
- Risks
- Open questions / assumptions

## Plan format

`docs/specs/<feature>/plan.md` should include:

- Existing system context with file paths
- Proposed architecture
- Data/API/model changes
- Implementation phases
- Verification strategy
- Migration / rollback concerns
- Risks and trade-offs

## Grilling checkpoints

Use grilling to prevent expensive wrong turns.

- Use **grill-me** after `/pf-spec` when the idea is fuzzy or has many product/design branches.
- Use **grill-with-docs** when the feature touches domain language, business rules, context boundaries, or architecture decisions.
- Grill before `/pf-tasks`; tasks created from an unchallenged plan encode mistakes into the task graph.
- Ask one question at a time. Do not implement during grilling.
- Capture resolved decisions immediately: glossary terms in `CONTEXT.md`, hard-to-reverse trade-offs in ADRs, feature decisions in spec/plan files.

## Task rules

Create small tasks that are independently testable. Each task needs:

- title
- description
- acceptance criteria
- verification command/evidence
- dependencies
- spec/plan references

Prefer beads commands:

```bash
bd status --json
bd create "Title" -p 1
bd dep add <child> <parent>
bd ready --json
bd update <id> --status in_progress
bd close <id> --reason "Completed: <evidence>"
bd sync
```

Never use interactive `bd edit`.

## WorkGraph usage

Use WorkGraph for work that benefits from explicit execution tracking:

- broad repo reconnaissance
- multiple dependent implementation steps
- separate review/verification
- unattended or long-running work

Default plan shape:

```text
scout -> implement -> test -> review
```

Use WorkGraph tools when available:

- `workgraph_create_plan`
- `workgraph_status`
- `workgraph_run`
- `workgraph_step_log`
- `workgraph_update_step`

## Done means evidence

Do not mark work done just because code was edited. Done requires evidence such as:

- test output
- build/typecheck/lint output
- browser automation/screenshot comparison
- curl/API check
- acceptance checklist with exact observations

## Handoff format

When stopping, write `docs/specs/<feature>/handoff.md` or `AGENT_PROGRESS.md`:

- Current state
- Completed tasks
- Changed files
- Verification evidence
- Remaining work
- Known bugs/risks
- Next recommended issue
- Exact resume commands
