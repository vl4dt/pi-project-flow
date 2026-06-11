# Using grill-me and grill-with-docs with Project Flow

Grilling is the quality gate between vague intent and expensive implementation.

## Where grilling fits

Recommended flow:

```text
/pf-spec
  ↓
/pf-grill or /pf-grill-docs
  ↓
/pf-plan
  ↓
/pf-grill-docs, if architecture/domain decisions are significant
  ↓
/pf-tasks
  ↓
/pf-execute
```

Do **not** wait until implementation to discover that the concept, vocabulary, or architecture is wrong.

## grill-me vs grill-with-docs

| Skill | Use when | Output |
|---|---|---|
| grill-me | You want to stress-test an idea, plan, UX, architecture, or sequencing. | Questions and recommended answers. Usually no file edits unless you ask. |
| grill-with-docs | The decision touches domain language, business rules, context boundaries, or architecture. | One-question-at-a-time interrogation plus updates to `CONTEXT.md`, ADRs, and spec/plan docs. |

## Good grilling targets

Use grilling for:

- new product features;
- major refactors;
- architecture changes;
- security/auth/payment flows;
- data model changes;
- anything with ambiguous terminology;
- features with many edge cases;
- tasks where the agent previously “did the wrong thing.”

Skip grilling for:

- typo fixes;
- obvious one-line changes;
- mechanical dependency bumps;
- already well-specified tasks with tests.

## Command examples

Stress-test a new feature spec:

```text
/pf-grill add recurring invoices
```

Stress-test against existing domain docs and update them:

```text
/pf-grill-docs recurring-invoices
```

Stress-test a plan before task creation:

```text
/pf-grill-docs docs/specs/recurring-invoices/plan.md
```

If you want editable prompt text before sending:

```text
/flow-grill-docs recurring-invoices
```

## What grill-with-docs should update

### `CONTEXT.md`

Only domain language and glossary-level relationships.

Good CONTEXT.md update:

```md
## Terms

- Subscription: A customer's agreement to receive recurring service on a billing cadence.
- Invoice: A request for payment generated for a billing period.
```

Bad CONTEXT.md update:

```md
We will implement subscriptions with Stripe webhooks in src/billing/stripe.ts.
```

Implementation belongs in specs/plans/ADRs, not the glossary.

### ADRs

Create an ADR only when the decision is:

1. hard to reverse;
2. surprising without context;
3. a real trade-off among alternatives.

Good ADR topics:

- choosing event sourcing for orders;
- using Postgres advisory locks for scheduling;
- making billing eventually consistent;
- rejecting soft deletes for audit reasons.

Bad ADR topics:

- naming a function;
- adding a small helper;
- choosing a CSS class.

### Spec/plan files

Resolved product/technical decisions should be reflected in:

```text
docs/specs/<feature>/spec.md
docs/specs/<feature>/plan.md
```

## A complete grilling session pattern

1. Start with a spec:

```text
/pf-spec add team invitations
```

2. Grill domain language:

```text
/pf-grill-docs team-invitations
```

3. Answer one question at a time. The agent should recommend an answer each time.

4. Let the agent update:

```text
CONTEXT.md
docs/specs/team-invitations/spec.md
docs/adr/<new-adr-if-needed>.md
```

5. Plan only after the big branches are resolved:

```text
/pf-plan team-invitations
```

6. Grill implementation risks:

```text
/pf-grill-docs team-invitations implementation plan
```

7. Create beads issues:

```text
/pf-tasks team-invitations
```

## Anti-patterns

Avoid these:

- Creating tasks before resolving glossary conflicts.
- Letting the agent ask 20 questions at once.
- Treating `CONTEXT.md` like a scratchpad.
- Creating ADRs for every small choice.
- Implementing while grilling.
- Marking a decision as final without updating spec/plan/docs.

## Improving the workflow over time

After a few projects, look for repeated grilling questions. If the same question appears often, encode it into:

- `AGENTS.md` as a rule;
- a spec template section;
- a beads task acceptance criterion;
- a verification script;
- a new project-flow command or prompt.
