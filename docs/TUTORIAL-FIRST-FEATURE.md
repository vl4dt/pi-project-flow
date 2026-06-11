# Tutorial: First Feature from Idea to Handoff

This tutorial walks through a fictional feature: **team invitations**.

## 0. Start Pi in your repo

```bash
cd path/to/your/repo
pi
```

If the package was just installed, restart Pi or run:

```text
/reload
```

## 1. Initialize project-flow

```text
/pf-init --beads
```

Expected result:

- `AGENTS.md` exists;
- `CONTEXT.md` exists;
- `docs/specs/` exists;
- `docs/adr/` exists;
- `.beads/` exists if `bd` is installed.

If beads is not installed, install it separately and rerun:

```bash
npm install -g @beads/bd
```

Then:

```bash
bd init
```

## 2. Write a spec

```text
/pf-spec team invitations: admins can invite users to a team by email, invitees accept through a signed link, expired invites cannot be accepted
```

Expected artifact:

```text
docs/specs/team-invitations/spec.md
```

Read the spec. If it does not match your intent, correct it before moving on.

## 3. Grill the spec against docs

```text
/pf-grill-docs team-invitations
```

The agent should ask one question at a time, for example:

```text
Question: Is an invited email considered a User before acceptance, or only an Invitation?
Recommended answer: Treat it as an Invitation until acceptance; create a User only after authentication/acceptance.
```

Answer each question. Let the agent update:

```text
CONTEXT.md
docs/specs/team-invitations/spec.md
```

If a hard-to-reverse architectural decision appears, let it create an ADR under:

```text
docs/adr/
```

## 4. Create a technical plan

```text
/pf-plan team-invitations
```

Expected artifact:

```text
docs/specs/team-invitations/plan.md
```

A good plan should list:

- affected files;
- database/API/model changes;
- implementation phases;
- testing strategy;
- risks and rollback.

## 5. Grill the plan

```text
/pf-grill-docs docs/specs/team-invitations/plan.md
```

Focus on:

- missing edge cases;
- security risks;
- token expiry/replay behavior;
- audit/logging;
- testability;
- migration risk.

Update the plan with resolved decisions.

## 6. Create beads tasks

```text
/pf-tasks team-invitations
```

The agent should create an epic plus small tasks, such as:

```text
bd-101 Epic: Team invitations
bd-102 Add Invitation domain model
bd-103 Add create invitation endpoint
bd-104 Add accept invitation flow
bd-105 Add expiry/replay tests
bd-106 Add UI for invite management
```

Check ready tasks:

```bash
bd ready --json
```

## 7. Execute one slice

```text
/pf-execute
```

The agent should:

1. pick one ready issue;
2. mark it in progress;
3. implement a small slice;
4. run focused tests;
5. run `scripts/verify.*` if present;
6. commit with issue ID;
7. update/close the beads issue.

For larger slices, it should use WorkGraph internally:

```text
scout -> implement -> test/review
```

## 8. Review

```text
/pf-review team-invitations
```

A passing review should include evidence:

```text
REVIEW_STATUS: pass
Evidence:
- pnpm test invitations passed
- pnpm typecheck passed
- acceptance criteria bd-103 verified
```

If it fails, fix blockers before closing the task.

## 9. Handoff

```text
/pf-handoff team-invitations
```

Expected artifact:

```text
docs/specs/team-invitations/handoff.md
```

It should tell the next agent exactly:

- what is done;
- what changed;
- what passed;
- what remains;
- known risks;
- next issue to pick.

## 10. End cleanly

Before leaving:

```bash
git status
bd ready --json
bd sync
```

If collaborating remotely:

```bash
git push
```

## The important habit

Do not ask the agent to “build the feature” in one shot. Ask it to move one ready issue from pending to verified and committed.
