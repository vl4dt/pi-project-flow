# Component Reference

## Pi

Pi is the terminal harness. It gives the model tools such as read, bash, edit, and write. It can be extended with:

- extensions: TypeScript code that adds commands/tools/UI;
- skills: on-demand workflow instructions;
- prompt templates: reusable prompts.

Useful Pi commands:

```text
/reload       reload extensions/skills/prompts
/model        switch model
/session      show session info
/compact      compact context
/tree         branch session history
```

## pi-project-flow

Adds the workflow layer:

```text
/pf-init
/pf-status
/pf-spec
/pf-grill
/pf-grill-docs
/pf-plan
/pf-tasks
/pf-execute
/pf-review
/pf-handoff
```

Agent tools:

```text
project_flow_status
project_flow_init
```

It creates and uses:

```text
AGENTS.md
CONTEXT.md
docs/adr/
docs/specs/
scripts/
```

## pi-workgraph

WorkGraph is the execution tracker. It persists plans and runs sub-agents.

Useful commands:

```text
/workgraph-init
/workgraph-new <goal>
/workgraph-status [planId]
/workgraph-run [planId]
/workgraph-yolo [planId]
/workgraph-log [planId] [stepId]
```

Agent tools:

```text
workgraph_create_plan
workgraph_status
workgraph_run
workgraph_step_log
workgraph_update_step
```

Files:

```text
.pi/workgraph.config.json
.pi/workgraph/plans/
.pi/workgraph/logs/
.pi/workgraph/runs/
```

Use WorkGraph when a task has multiple phases or benefits from separate scout/implement/review agents.

## beads (`bd`)

Beads is the durable issue/task graph.

Common commands:

```bash
bd init
bd status --json
bd ready --json
bd create "Title" -p 1
bd update <id> --status in_progress
bd dep add <child> <parent>
bd close <id> --reason "Completed: evidence"
bd sync
```

Use beads for:

- epics;
- feature tasks;
- blockers/dependencies;
- cross-session memory;
- multi-agent coordination.

Do not use interactive `bd edit` from an agent. Use `bd update` flags.

## git

Git is the durable proof of code changes.

Common commands:

```bash
git status
git diff
git add <files>
git commit -m "Message (bd-123)"
git log --oneline -10
git restore <file>
```

Project-flow convention:

```text
one verified slice -> one commit -> message includes beads issue ID
```

## tests and verification scripts

Agents need pass/fail checks. Create one project-level command if possible:

```text
scripts/verify.ps1
scripts/verify.sh
```

It can run:

```text
format check
lint
typecheck
unit tests
integration tests
build
```

A task should not close without verification evidence.

## grill-me

Use for conceptual interrogation. It asks one question at a time and recommends an answer.

Good for:

- product ambiguity;
- UX/design options;
- architecture alternatives;
- sequencing risks.

Project-flow command:

```text
/pf-grill <feature-or-plan>
```

## grill-with-docs

Use when the plan should be challenged against project language and decisions.

It may update:

```text
CONTEXT.md
docs/adr/
docs/specs/<feature>/spec.md
docs/specs/<feature>/plan.md
```

Project-flow command:

```text
/pf-grill-docs <feature-or-plan>
```

## How they work together

```text
Pi provides the harness.
pi-project-flow provides the workflow.
grill skills improve intent and plans.
beads tracks durable tasks.
WorkGraph tracks live execution.
git records code changes.
tests prove correctness.
```
