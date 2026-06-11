---
description: Project Flow: execute one ready beads issue using WorkGraph when useful
argument-hint: "[issue-id or goal]"
---
Use the project-flow skill. Execute one project-flow slice: ${ARGUMENTS:-pick the highest-priority ready issue}

Workflow:
1. Run project_flow_status.
2. Use bd ready --json and pick/confirm one issue unless an issue id was provided.
3. Mark it in_progress.
4. For multi-step work, create a WorkGraph plan with scout -> implement -> test/review steps and run it; for small work, implement directly.
5. Run focused tests and scripts/verify.ps1 or scripts/verify.sh if present.
6. Commit with the beads issue id if changes are made.
7. Close/update beads only with evidence.
8. Leave a concise handoff if anything remains.
