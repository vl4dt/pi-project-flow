---
description: Project Flow: review current changes against spec/tasks
argument-hint: "[feature-or-issue]"
---
Use the project-flow skill. Review current project changes ${ARGUMENTS:-against the active spec/task}.

Check git diff/status, relevant spec/plan/tasks, tests, security/correctness, docs updates, and beads status. Run safe verification commands if needed. End with REVIEW_STATUS: pass or fail and list blocking fixes only if fail.
