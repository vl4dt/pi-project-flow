---
description: Project Flow: write/update handoff notes
argument-hint: "[feature-or-issue]"
---
Use the project-flow skill. Write a compact handoff for ${ARGUMENTS:-the current project-flow work}.

Include: current state, completed tasks, changed files, verification evidence, remaining tasks, known risks/bugs, next recommended bd issue, and exact commands to resume. Put it under docs/specs/<feature>/handoff.md when a feature is known, otherwise AGENT_PROGRESS.md.
