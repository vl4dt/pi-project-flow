# Improving the Project Flow Over Time

Project-flow is meant to evolve with your work. Treat the workflow itself as product code.

## After every feature

Run a short retrospective:

```text
What did the agent misunderstand?
What context was missing?
Which question should have been asked earlier?
Which verification step caught or would have caught the bug?
Which docs should be updated so this mistake does not repeat?
```

Then encode the answer into the repo.

## Where to encode improvements

| Problem | Best place to fix it |
|---|---|
| Agent uses wrong domain term | `CONTEXT.md` |
| Agent repeats architectural mistake | `docs/adr/` or `AGENTS.md` |
| Spec misses recurring requirement | spec template / `/flow-spec` prompt |
| Plan misses recurring risk | plan template / `/flow-plan` prompt |
| Tasks are too large | beads task creation guidance |
| Agent marks done too early | acceptance criteria + verify script |
| Agent forgets how to run app | `scripts/verify.*`, `scripts/dev.*`, README |
| Context gets stale | `/pf-handoff`, `bd sync`, git commits |

## Upgrade path

### Level 1: Basic

Use:

```text
/pf-spec -> /pf-plan -> /pf-tasks -> /pf-execute
```

### Level 2: Grilled

Add:

```text
/pf-grill-docs after spec and plan
```

### Level 3: Verified

Add:

```text
scripts/verify.ps1 or scripts/verify.sh
```

Make every task include a verification command.

### Level 4: WorkGraphed

Use WorkGraph for non-trivial execution:

```text
scout -> implement -> test -> review
```

Track logs and status under `.pi/workgraph/`.

### Level 5: Project-specific package

If your project has recurring flow needs, create project-local prompts/skills:

```text
.pi/prompts/
.pi/skills/
.pi/extensions/
```

Examples:

- `/billing-spec`
- `/security-review`
- `/ui-acceptance`
- `/release-checklist`

## Metrics worth watching

You do not need a dashboard at first. Just notice:

- How many tasks are reopened after “done”?
- How often does the agent ask questions already answered in docs?
- How often does a task lack clear verification?
- How often does implementation diverge from the spec?
- Are beads issues too large or too small?
- Does `CONTEXT.md` stay glossary-only?

## Good defaults to add to every repo

```text
AGENTS.md
CONTEXT.md
docs/adr/
docs/specs/
scripts/verify.*
.beads/
```

## When to change pi-project-flow itself

Change the package when an improvement is broadly useful across projects.

Good package changes:

- better `/pf-status` summary;
- a new `/pf-retro` command;
- richer integration with WorkGraph plan templates;
- better beads parsing;
- dashboard widget for active issue/plan/verification status.

Keep project-specific behavior in the project repo.
