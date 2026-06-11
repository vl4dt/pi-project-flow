---
description: Project Flow: stress-test a spec/plan against CONTEXT.md and ADRs
argument-hint: "<feature-or-plan>"
---
Use the grill-with-docs skill with the project-flow workflow for: $ARGUMENTS

Context:
- Read CONTEXT.md, CONTEXT-MAP.md if present, docs/adr/, and docs/specs/<feature>/spec.md / plan.md if present.
- Challenge terminology against the project glossary.
- Ask one question at a time and wait for my answer.
- If a term is resolved, update CONTEXT.md inline.
- If a durable architectural decision meets ADR criteria, offer to create an ADR.
- After grilling, update the relevant spec/plan with clarified decisions and open questions.
- Do not implement code during the grilling session.
