import * as fs from "node:fs";
import * as path from "node:path";
import { spawnSync } from "node:child_process";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

type Json = Record<string, unknown>;

function run(cmd: string, args: string[], cwd: string, timeout = 8_000) {
  const r = spawnSync(cmd, args, { cwd, encoding: "utf8", timeout, shell: process.platform === "win32" });
  return {
    ok: r.status === 0,
    code: r.status ?? null,
    stdout: (r.stdout ?? "").trim(),
    stderr: (r.stderr ?? "").trim(),
    error: r.error?.message,
  };
}

function exists(cwd: string, rel: string) {
  return fs.existsSync(path.join(cwd, rel));
}

function ensureDir(cwd: string, rel: string) {
  fs.mkdirSync(path.join(cwd, rel), { recursive: true });
}

function writeIfMissing(cwd: string, rel: string, content: string) {
  const file = path.join(cwd, rel);
  if (!fs.existsSync(file)) fs.writeFileSync(file, content, "utf8");
}

function latestWorkGraphPlan(cwd: string) {
  const dir = path.join(cwd, ".pi", "workgraph", "plans");
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith(".json"))
    .map(f => ({ f, stat: fs.statSync(path.join(dir, f)) }))
    .sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs);
  if (!files[0]) return null;
  try {
    const data = JSON.parse(fs.readFileSync(path.join(dir, files[0].f), "utf8"));
    return {
      id: data.id,
      goal: data.goal,
      status: data.status,
      steps: Array.isArray(data.steps) ? data.steps.map((s: any) => ({ id: s.id, title: s.title, status: s.status, kind: s.kind })) : [],
      file: path.join(".pi", "workgraph", "plans", files[0].f),
    };
  } catch {
    return { file: path.join(".pi", "workgraph", "plans", files[0].f), error: "failed to parse plan" };
  }
}

function collectStatus(cwd: string) {
  const gitStatus = run("git", ["status", "--short", "--branch"], cwd);
  const gitLog = run("git", ["log", "--oneline", "-5"], cwd);
  const bdStatus = run("bd", ["status", "--json"], cwd);
  const bdReady = run("bd", ["ready", "--json"], cwd);
  const beadsAvailable = bdStatus.ok || bdReady.ok;
  return {
    cwd,
    files: {
      agents: exists(cwd, "AGENTS.md"),
      context: exists(cwd, "CONTEXT.md"),
      adrDir: exists(cwd, path.join("docs", "adr")),
      specsDir: exists(cwd, path.join("docs", "specs")),
      verifyPs1: exists(cwd, path.join("scripts", "verify.ps1")),
      verifySh: exists(cwd, path.join("scripts", "verify.sh")),
      beadsDir: exists(cwd, ".beads"),
      workgraphConfig: exists(cwd, path.join(".pi", "workgraph.config.json")),
    },
    git: {
      ok: gitStatus.ok,
      status: gitStatus.stdout || gitStatus.stderr || gitStatus.error || "",
      recent: gitLog.stdout,
    },
    beads: {
      available: beadsAvailable,
      status: bdStatus.ok ? safeJson(bdStatus.stdout) : null,
      ready: bdReady.ok ? safeJson(bdReady.stdout) : null,
      error: beadsAvailable ? undefined : (bdReady.stderr || bdStatus.stderr || bdReady.error || bdStatus.error || "bd not available or repo not initialized"),
    },
    workgraph: {
      latestPlan: latestWorkGraphPlan(cwd),
    },
  };
}

function safeJson(s: string) {
  try { return JSON.parse(s); } catch { return s; }
}

function summarizeStatus(s: ReturnType<typeof collectStatus>) {
  const readyCount = Array.isArray(s.beads.ready) ? s.beads.ready.length : undefined;
  const wg = s.workgraph.latestPlan as any;
  const wgLine = wg?.id ? `${wg.id} (${wg.status})` : "none";
  return [
    `Project Flow`,
    `cwd: ${s.cwd}`,
    `git: ${s.git.ok ? "ok" : "not git?"}`,
    `dirty: ${s.git.status ? "yes" : "no"}`,
    `beads: ${s.beads.available ? `ok${readyCount !== undefined ? `, ready=${readyCount}` : ""}` : "missing/uninit"}`,
    `workgraph: ${wgLine}`,
    `docs: AGENTS=${s.files.agents} CONTEXT=${s.files.context} specs=${s.files.specsDir} adr=${s.files.adrDir}`,
    `verify: ps1=${s.files.verifyPs1} sh=${s.files.verifySh}`,
  ].join("\n");
}

const AGENTS = `# Agentic Project Flow\n\nFor non-trivial work, use the project-flow workflow:\n\n1. Read CONTEXT.md and relevant docs/adr/ records.\n2. Clarify intent in docs/specs/<feature>/spec.md before implementation.\n3. Translate the spec into docs/specs/<feature>/plan.md with architecture, constraints, risks, and verification.\n4. Break the plan into small independently verifiable tasks in beads (bd), with dependencies and acceptance criteria.\n5. Use WorkGraph for multi-step or multi-agent execution waves.\n6. Work one vertical slice at a time.\n7. Run scripts/verify.ps1 or scripts/verify.sh before marking work done when present.\n8. Commit with the beads issue ID in the message.\n9. Update beads and handoff/progress notes before stopping.\n\nNever mark work done without evidence: tests, build output, lint/typecheck, browser automation, or an explicit acceptance checklist.\nDo not rely on chat history as project memory.\n`;

const CONTEXT = `# Project Context\n\n## Purpose\n\nDescribe what this project is for and who it serves.\n\n## Domain language\n\n- Term: Meaning\n\n## Architecture map\n\n- Area: Files/modules and responsibilities\n\n## Commands\n\n- Install:\n- Run:\n- Test:\n- Verify:\n\n## Non-obvious gotchas\n\n- \n`;

function sendOrWarn(pi: ExtensionAPI, ctx: any, prompt: string) {
  if (!ctx.isIdle()) {
    pi.sendUserMessage(prompt, { deliverAs: "followUp" });
    ctx.ui.notify("Project Flow prompt queued as follow-up", "info");
  } else {
    pi.sendUserMessage(prompt);
  }
}

export default function (pi: ExtensionAPI) {
  pi.on("session_start", async (_event, ctx) => {
    try {
      const s = collectStatus(ctx.cwd);
      const ready = Array.isArray(s.beads.ready) ? s.beads.ready.length : "?";
      const dirty = s.git.status ? "dirty" : "clean";
      ctx.ui.setStatus("project-flow", `pf ${dirty} bd:${s.beads.available ? ready : "-"}`);
    } catch {
      // best effort only
    }
  });

  pi.registerTool({
    name: "project_flow_status",
    label: "Project Flow Status",
    description: "Return concise project-flow status: git state, beads readiness, WorkGraph latest plan, expected docs/scripts.",
    parameters: Type.Object({}),
    async execute(_toolCallId, _params, _signal, _onUpdate, ctx) {
      const status = collectStatus(ctx.cwd);
      return {
        content: [{ type: "text", text: summarizeStatus(status) + "\n\nJSON:\n" + JSON.stringify(status, null, 2) }],
        details: status as Json,
      };
    },
  });

  pi.registerTool({
    name: "project_flow_init",
    label: "Init Project Flow",
    description: "Create project-flow scaffold files/directories if missing: AGENTS.md, CONTEXT.md, docs/specs, docs/adr, scripts.",
    parameters: Type.Object({
      overwrite: Type.Optional(Type.Boolean({ description: "Overwrite AGENTS.md and CONTEXT.md if they already exist. Default false." })),
      initBeads: Type.Optional(Type.Boolean({ description: "Run bd init if bd is installed and .beads is missing. Default false." })),
    }),
    async execute(_toolCallId, params: any, _signal, _onUpdate, ctx) {
      ensureDir(ctx.cwd, path.join("docs", "specs"));
      ensureDir(ctx.cwd, path.join("docs", "adr"));
      ensureDir(ctx.cwd, "scripts");
      if (params.overwrite || !exists(ctx.cwd, "AGENTS.md")) fs.writeFileSync(path.join(ctx.cwd, "AGENTS.md"), AGENTS, "utf8");
      if (params.overwrite || !exists(ctx.cwd, "CONTEXT.md")) fs.writeFileSync(path.join(ctx.cwd, "CONTEXT.md"), CONTEXT, "utf8");
      writeIfMissing(ctx.cwd, path.join("docs", "adr", "0001-record-architecture-decisions.md"), `# ADR 0001: Record architecture decisions\n\nDate: ${new Date().toISOString().slice(0, 10)}\n\n## Status\n\nAccepted\n\n## Context\n\nAgentic development needs durable architectural memory outside chat history.\n\n## Decision\n\nRecord significant project architecture decisions under docs/adr/.\n\n## Consequences\n\nAgents and humans can recover why the system is shaped as it is.\n`);
      let beads: unknown = "skipped";
      if (params.initBeads && !exists(ctx.cwd, ".beads")) beads = run("bd", ["init"], ctx.cwd, 30_000);
      const status = collectStatus(ctx.cwd);
      return {
        content: [{ type: "text", text: `Project Flow scaffold ready.\n\n${summarizeStatus(status)}\n\nbeads init: ${JSON.stringify(beads)}` }],
        details: { status, beads } as Json,
      };
    },
  });

  pi.registerCommand("pf-init", {
    description: "Initialize project-flow scaffold and optionally beads/workgraph config",
    handler: async (args, ctx) => {
      const initBeads = args.includes("--beads");
      const overwrite = args.includes("--force");
      ensureDir(ctx.cwd, path.join("docs", "specs"));
      ensureDir(ctx.cwd, path.join("docs", "adr"));
      ensureDir(ctx.cwd, "scripts");
      if (overwrite || !exists(ctx.cwd, "AGENTS.md")) fs.writeFileSync(path.join(ctx.cwd, "AGENTS.md"), AGENTS, "utf8");
      if (overwrite || !exists(ctx.cwd, "CONTEXT.md")) fs.writeFileSync(path.join(ctx.cwd, "CONTEXT.md"), CONTEXT, "utf8");
      if (initBeads && !exists(ctx.cwd, ".beads")) run("bd", ["init"], ctx.cwd, 30_000);
      ctx.ui.notify("Project Flow scaffold initialized", "info");
    },
  });

  pi.registerCommand("pf-status", {
    description: "Show git/beads/WorkGraph project-flow status",
    handler: async (_args, ctx) => {
      const s = collectStatus(ctx.cwd);
      ctx.ui.setWidget("project-flow-status", summarizeStatus(s).split("\n"));
      ctx.ui.notify("Project Flow status shown", "info");
    },
  });

  pi.registerCommand("pf-spec", {
    description: "Create/refine a feature spec under docs/specs/<feature>/spec.md",
    handler: async (args, ctx) => {
      sendOrWarn(pi, ctx, `Use the project-flow skill. Create or refine a spec for: ${args}\n\nSteps:\n1. Inspect existing CONTEXT.md, docs/adr/, README, and relevant files only as needed.\n2. Create docs/specs/<slug>/spec.md.\n3. Include what/why, users, requirements, non-goals, acceptance criteria, risks, and open questions.\n4. Do not implement code. If critical questions block a correct spec, ask them; otherwise make explicit assumptions.`);
    },
  });

  pi.registerCommand("pf-plan", {
    description: "Create technical plan for an existing/new spec",
    handler: async (args, ctx) => {
      sendOrWarn(pi, ctx, `Use the project-flow skill. Create a technical implementation plan for: ${args}\n\nRead docs/specs/<feature>/spec.md if present, CONTEXT.md, docs/adr/, and relevant code. Write docs/specs/<feature>/plan.md with architecture, files likely touched, data/API changes, testing strategy, migration/rollback concerns, risks, and phased implementation. Do not implement code.`);
    },
  });

  pi.registerCommand("pf-tasks", {
    description: "Convert a spec/plan into beads issues and dependencies",
    handler: async (args, ctx) => {
      sendOrWarn(pi, ctx, `Use the project-flow skill. Convert this spec/plan into durable beads issues: ${args}\n\nRequirements:\n- Check bd status; if beads is unavailable or uninitialized, tell me the exact command needed.\n- Read docs/specs/<feature>/spec.md and plan.md.\n- Create an epic plus small independently verifiable tasks using bd create --json where supported.\n- Add dependencies with bd dep add.\n- Each task must include acceptance criteria and verification command/evidence.\n- End by showing bd ready --json and the recommended first issue.`);
    },
  });

  pi.registerCommand("pf-execute", {
    description: "Execute one ready beads issue using WorkGraph when useful",
    handler: async (args, ctx) => {
      sendOrWarn(pi, ctx, `Use the project-flow skill. Execute one project-flow slice: ${args || "pick the highest-priority ready issue"}\n\nWorkflow:\n1. Run project_flow_status.\n2. Use bd ready --json and pick/confirm one issue unless an issue id was provided.\n3. Mark it in_progress.\n4. For multi-step work, create a WorkGraph plan with scout -> implement -> test/review steps and run it; for small work, implement directly.\n5. Run focused tests and scripts/verify.ps1 or scripts/verify.sh if present.\n6. Commit with the beads issue id if changes are made.\n7. Close/update beads only with evidence.\n8. Leave a concise handoff if anything remains.`);
    },
  });

  pi.registerCommand("pf-review", {
    description: "Review current changes against spec/tasks and verification evidence",
    handler: async (args, ctx) => {
      sendOrWarn(pi, ctx, `Use the project-flow skill. Review current project changes${args ? ` for ${args}` : ""}.\n\nCheck git diff/status, relevant spec/plan/tasks, tests, security/correctness, docs updates, and beads status. Run safe verification commands if needed. End with REVIEW_STATUS: pass or fail and list blocking fixes only if fail.`);
    },
  });

  pi.registerCommand("pf-handoff", {
    description: "Write/update handoff/progress notes for current agentic work",
    handler: async (args, ctx) => {
      sendOrWarn(pi, ctx, `Use the project-flow skill. Write a compact handoff for ${args || "the current project-flow work"}.\n\nInclude: current state, completed tasks, changed files, verification evidence, remaining tasks, known risks/bugs, next recommended bd issue, and exact commands to resume. Put it under docs/specs/<feature>/handoff.md when a feature is known, otherwise AGENT_PROGRESS.md.`);
    },
  });
}
