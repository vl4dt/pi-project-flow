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
- `/pf-grill <feature-or-plan>` - stress-test a spec/plan with the `grill-me` skill.
- `/pf-grill-docs <feature-or-plan>` - stress-test against `CONTEXT.md`/ADRs with the `grill-with-docs` skill and update docs as decisions crystallize.
- `/pf-tasks <feature>` - create beads tasks/dependencies from spec+plan.
- `/pf-execute [issue-id-or-goal]` - execute one slice, using WorkGraph when useful.
- `/pf-review [feature-or-issue]` - review current changes.
- `/pf-handoff [feature-or-issue]` - write compact handoff/progress notes.

Prompt templates are also included as `/flow-spec`, `/flow-grill`, `/flow-grill-docs`, `/flow-plan`, `/flow-tasks`, `/flow-execute`, `/flow-review`, and `/flow-handoff`.

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
/pf-grill-docs oauth-login
/pf-plan oauth-login
/pf-grill-docs docs/specs/oauth-login/plan.md
/pf-tasks oauth-login
/pf-execute
/pf-review
/pf-handoff
```

## Documentation

Start here if you are new to the stack:

- [Beginner Guide](docs/BEGINNER-GUIDE.md) - what each component does and the first-session flow.
- [Component Reference](docs/COMPONENTS.md) - Pi, project-flow, WorkGraph, beads, git/tests, and grill skills.
- [Tutorial: New Project from Grilled Idea to Completed Build](docs/TUTORIAL-NEW-PROJECT-FROM-IDEA.md) - end-to-end greenfield guide from raw idea to completed MVP.
- [Tutorial: First Feature](docs/TUTORIAL-FIRST-FEATURE.md) - complete walkthrough for one feature in a project.
- [Using Grilling with Project Flow](docs/GRILLING-WITH-PROJECT-FLOW.md) - where `grill-me` and `grill-with-docs` fit.
- [Improvement Loop](docs/IMPROVEMENT-LOOP.md) - how to evolve the workflow over time.

## WorkGraph relationship

This package intentionally does not duplicate WorkGraph. WorkGraph already provides the execution substrate: persisted plans, sub-agent scheduling, logs, status, and YOLO mode. `pi-project-flow` adds the higher-level product-development workflow around it: specs, beads task graph, verification, and handoff.
