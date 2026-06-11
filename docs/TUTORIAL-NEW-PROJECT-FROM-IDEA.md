# Tutorial: New Project from Grilled Idea to Completed Build

This tutorial shows the full project-flow path for a brand-new project, starting before code exists.

Use it when you have an idea like:

> I want to build a personal finance app for freelancers that imports bank transactions, categorizes them, and estimates quarterly taxes.

The goal is not to make the agent code immediately. The goal is to turn the idea into durable project memory, stress-test it, plan it, break it into verifiable slices, then build slice by slice until the project is complete.

## Phase 0: Create the repo

Create an empty project folder and start Pi there.

```bash
mkdir freelance-tax-helper
cd freelance-tax-helper
git init
pi
```

If you just installed or updated `pi-project-flow`, run:

```text
/reload
```

## Phase 1: Initialize project-flow

Inside Pi:

```text
/pf-init --beads
```

This creates the project memory structure:

```text
AGENTS.md                  agent operating rules
CONTEXT.md                 domain glossary
docs/adr/                  architecture decisions
docs/specs/                specs, plans, handoffs
scripts/                   verification scripts
.beads/                    durable task graph, if bd is installed
```

If beads is not installed, install it outside Pi:

```bash
npm install -g @beads/bd
bd init
```

Then commit the initial scaffold:

```bash
git add .
git commit -m "Initialize project-flow scaffold"
```

## Phase 2: Grill the raw idea before writing a spec

Start with `grill-me` when the idea is still fuzzy:

```text
/pf-grill I want to build a personal finance app for freelancers that imports bank transactions, categorizes them, and estimates quarterly taxes
```

The agent should ask one question at a time and include a recommended answer.

Example:

```text
Question: Is the first version for manual CSV import only, or direct bank integration?
Recommended answer: Start with manual CSV import. Bank integrations add OAuth, vendor dependencies, and compliance risk before the core categorization/tax model is proven.
```

Answer until the major branches are resolved:

- target user;
- first platform;
- must-have workflow;
- excluded features;
- data ownership/privacy;
- success criteria;
- MVP boundary.

Do not let the agent implement code yet.

## Phase 3: Create the initial spec

Now create the spec from the grilled idea:

```text
/pf-spec freelance tax helper MVP: CSV import, transaction categorization, quarterly tax estimate, local-first data, no bank OAuth in v1
```

Expected file:

```text
docs/specs/freelance-tax-helper-mvp/spec.md
```

A good spec includes:

- problem;
- users;
- goals;
- non-goals;
- user journeys;
- requirements;
- acceptance criteria;
- risks;
- open questions.

Read it. If it feels generic, grill again.

## Phase 4: Grill the spec with docs

Now use `grill-with-docs` so project language is captured in `CONTEXT.md`:

```text
/pf-grill-docs freelance-tax-helper-mvp
```

The agent should read:

```text
CONTEXT.md
docs/specs/freelance-tax-helper-mvp/spec.md
```

It should challenge terms like:

- Transaction
- Category
- Tax Estimate
- Deduction
- Business Expense
- Import Batch
- Freelancer

Good resolved glossary entries go into `CONTEXT.md`.

Example:

```md
- Transaction: A single imported financial row representing money entering or leaving an account.
- Import Batch: A set of transactions imported from one source file at one time.
- Tax Estimate: A non-filing projection of expected quarterly tax liability based on categorized income and deductible expenses.
```

If the agent proposes implementation details for `CONTEXT.md`, reject that. `CONTEXT.md` is glossary/domain language only.

## Phase 5: Decide the technical direction

Ask for a plan:

```text
/pf-plan freelance-tax-helper-mvp
```

If the project has no stack yet, provide constraints:

```text
/pf-plan freelance-tax-helper-mvp using Dioxus desktop app, local SQLite database, Rust backend logic, CSV import, no cloud account system in v1
```

Expected file:

```text
docs/specs/freelance-tax-helper-mvp/plan.md
```

The plan should include:

- chosen stack;
- architecture;
- module boundaries;
- data model;
- UI screens;
- implementation phases;
- verification strategy;
- risks;
- rollback/simplification options.

## Phase 6: Grill the technical plan

This is where `grill-with-docs` is most valuable.

```text
/pf-grill-docs docs/specs/freelance-tax-helper-mvp/plan.md
```

The agent should challenge questions like:

- Is local-only storage a real requirement or just v1 convenience?
- What happens if a CSV import is partially invalid?
- Can users undo an import batch?
- Are categories user-defined or fixed?
- Is the tax estimate jurisdiction-specific?
- What must be true before a transaction can affect tax estimates?
- What is the minimum useful vertical slice?

Create ADRs only for durable trade-offs.

Example ADR-worthy decisions:

```text
Use local SQLite instead of cloud sync for v1.
Use import batches to support undo and auditability.
Treat tax estimates as projections, not filing advice.
```

## Phase 7: Create the project skeleton

Now implementation can begin, but still as a slice.

Create a beads epic and tasks:

```text
/pf-tasks freelance-tax-helper-mvp
```

Expected task graph shape:

```text
Epic: Freelance Tax Helper MVP
  ├─ Initialize app skeleton and verify build
  ├─ Add local database schema
  ├─ Implement CSV import into import batches
  ├─ Display imported transactions
  ├─ Add transaction categorization
  ├─ Calculate income/expense totals
  ├─ Estimate quarterly taxes
  ├─ Add undo import batch
  └─ End-to-end MVP verification
```

Each task should have acceptance criteria and verification evidence.

Bad task:

```text
Build the app
```

Good task:

```text
Initialize Dioxus desktop skeleton with a passing verify script
Acceptance:
- app launches locally
- scripts/verify.ps1 runs cargo check/test or equivalent
- README documents run/test commands
```

## Phase 8: Build the first vertical slice

Run:

```text
/pf-execute
```

The first slice should usually be project skeleton + verification script, not advanced features.

The agent should:

1. inspect `bd ready --json`;
2. pick the first ready issue;
3. mark it in progress;
4. implement only that slice;
5. create or update `scripts/verify.ps1` / `scripts/verify.sh`;
6. run verification;
7. commit with the beads issue ID;
8. close/update the issue with evidence.

Example commit:

```text
Initialize Dioxus app skeleton (bd-123)
```

## Phase 9: Continue slice by slice

Repeat:

```text
/pf-status
/pf-execute
/pf-review
```

For each slice, insist on evidence.

Example completed slice:

```text
Issue: bd-127 Implement CSV import into import batches
Changed:
- src/import/csv.rs
- src/domain/import_batch.rs
- tests/import_csv_test.rs
Verification:
- cargo test import_csv passed
- scripts/verify.ps1 passed
Commit:
- a1b2c3d Implement CSV import batches (bd-127)
```

If a slice is large or risky, tell the agent to use WorkGraph explicitly:

```text
Create a WorkGraph plan for bd-127 with scout, implement, test, and review steps, then run one round.
```

Or use:

```text
/workgraph-new implement CSV import batches for bd-127
/workgraph-run
/workgraph-status
```

## Phase 10: Review after each meaningful increment

Use:

```text
/pf-review freelance-tax-helper-mvp
```

A good review checks:

- current diff;
- spec acceptance criteria;
- task acceptance criteria;
- test coverage;
- error handling;
- security/privacy;
- docs updates;
- beads status.

It should end with:

```text
REVIEW_STATUS: pass
```

or:

```text
REVIEW_STATUS: fail
Blocking issues:
1. Import errors are swallowed instead of surfaced to the user.
2. No test covers duplicate transaction rows.
```

Do not move on if review fails.

## Phase 11: Use handoffs to survive long projects

At the end of every session:

```text
/pf-handoff freelance-tax-helper-mvp
```

Expected file:

```text
docs/specs/freelance-tax-helper-mvp/handoff.md
```

It should include:

- what is complete;
- what changed;
- verification evidence;
- current beads status;
- current WorkGraph status if any;
- known bugs;
- next recommended issue;
- exact commands to resume.

Then sync durable state:

```bash
bd sync
git status
```

If using a remote:

```bash
git push
```

## Phase 12: MVP completion gate

When all feature tasks appear done, do not declare victory yet. Create a final acceptance task if one does not exist:

```text
/pf-tasks freelance-tax-helper-mvp final MVP acceptance pass
```

Or manually create:

```bash
bd create "Final MVP acceptance pass" -p 0
```

Then run:

```text
/pf-execute final MVP acceptance pass
```

The final pass should verify:

- all spec acceptance criteria;
- clean install/setup from README;
- app starts from scratch;
- representative user journey works end-to-end;
- tests pass;
- no critical TODOs remain;
- docs match actual behavior;
- beads has no open MVP-blocking tasks.

## Phase 13: Completion handoff

Create a final handoff/release note:

```text
/pf-handoff freelance-tax-helper-mvp completed MVP
```

Recommended final files:

```text
docs/specs/freelance-tax-helper-mvp/handoff.md
docs/specs/freelance-tax-helper-mvp/completion-report.md
```

The report should say:

```text
What was built
What was intentionally not built
How to run it
How to test it
Known limitations
Future work
Final verification evidence
```

Then commit:

```bash
git add .
git commit -m "Complete freelance tax helper MVP"
```

## Full command summary

```text
/pf-init --beads
/pf-grill <raw idea>
/pf-spec <clarified MVP>
/pf-grill-docs <feature>
/pf-plan <feature and stack constraints>
/pf-grill-docs docs/specs/<feature>/plan.md
/pf-tasks <feature>
/pf-execute
/pf-review
/pf-handoff <feature>
# repeat execute/review/handoff until done
/pf-execute final MVP acceptance pass
/pf-handoff <feature> completed MVP
```

## The most important rule

A new project succeeds when the agent always knows three things:

1. **What are we building?** → `docs/specs/<feature>/spec.md`
2. **How are we building it?** → `docs/specs/<feature>/plan.md` and ADRs
3. **What should I do next?** → `bd ready --json` and WorkGraph status

If any of those are unclear, stop and grill before coding.
