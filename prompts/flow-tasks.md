---
description: Project Flow: convert spec/plan into beads issues
argument-hint: "<feature>"
---
Use the project-flow skill. Convert this spec/plan into durable beads issues: $ARGUMENTS

Requirements:
- Check bd status; if beads is unavailable or uninitialized, tell me the exact command needed.
- Read docs/specs/<feature>/spec.md and plan.md.
- Create an epic plus small independently verifiable tasks using bd create.
- Add dependencies with bd dep add.
- Each task must include acceptance criteria and verification command/evidence.
- End by showing bd ready --json and the recommended first issue.
