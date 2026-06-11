---
description: Project Flow: stress-test a spec/plan with grill-me
argument-hint: "<feature-or-plan>"
---
Use the grill-me skill to stress-test this project-flow plan/spec: $ARGUMENTS

Context:
- If docs/specs/<feature>/spec.md or plan.md exists, read it first.
- If the answer can be found by inspecting the codebase, inspect the codebase instead of asking me.
- Ask one question at a time.
- For each question, include your recommended answer.
- Focus on hidden assumptions, missing acceptance criteria, risky dependencies, sequencing, and verification gaps.
- Do not implement code during the grilling session.
