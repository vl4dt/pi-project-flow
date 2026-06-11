# pi-project-flow

Pi package for the current best-practice agentic coding workflow:

```text
spec -> plan -> tasks -> execute -> verify -> commit -> handoff
```

It is designed to sit above:

- **beads (`bd`)** for durable project issue/task graph;
- **pi-workgraph** for live multi-agent execution plans;
- **git + tests** for proof and rollback.

## Install

Local development install:

```bash
pi install /absolute/path/to/pi-project-flow
```

Recommended companion package:

```bash
pi install /absolute/path/to/pi-workgraph
```

## Commands

Extension commands that immediately send a full project-flow prompt:

- `/pf-init [--beads] [--force]` - create scaffold files/directories.
- `/pf-status` - show git/beads/WorkGraph status widget.
- `/pf-spec <feature-or-goal>` - create/refine `docs/specs/<feature>/spec.md`.
- `/pf-plan <feature>` - create `docs/specs/<feature>/plan.md`.
- `/pf-tasks <feature>` - create beads tasks/dependencies from spec+plan.
- `/pf-execute [issue-id-or-goal]` - execute one slice, using WorkGraph when useful.
- `/pf-review [feature-or-issue]` - review current changes.
- `/pf-handoff [feature-or-issue]` - write compact handoff/progress notes.

Prompt templates are also included as `/flow-spec`, `/flow-plan`, `/flow-tasks`, `/flow-execute`, `/flow-review`, and `/flow-handoff`.

## Agent tools

- `project_flow_status` - returns git/beads/WorkGraph/docs status.
- `project_flow_init` - creates scaffold files and optional beads init.

## Scaffold

`/pf-init` creates:

```text
AGENTS.md
CONTEXT.md
docs/adr/
docs/specs/
scripts/
```

Use `--beads` to run `bd init` if needed.

## Recommended workflow

```text
/pf-init --beads
/pf-spec add OAuth login
/pf-plan oauth-login
/pf-tasks oauth-login
/pf-execute
/pf-review
/pf-handoff
```

## WorkGraph relationship

This package intentionally does not duplicate WorkGraph. WorkGraph already provides the execution substrate: persisted plans, sub-agent scheduling, logs, status, and YOLO mode. `pi-project-flow` adds the higher-level product-development workflow around it: specs, beads task graph, verification, and handoff.
