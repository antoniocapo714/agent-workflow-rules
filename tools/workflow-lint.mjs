#!/usr/bin/env bun
// Checks a workflow script for Claude Code's Workflow tool before it is launched (see RULES.md, section 9). Fails when:
// - the meta block has no description;
// - meta has no `level` 0 to 3; it declares level 0 (trivial), which is never a workflow; level 1 (a sketch, a board,
//   a frame the user judges) has more than one agent, a review, judge, verify or fix step, or an estimate over 30 minutes;
//   level 2 or 3 has no review, judge or verify step, unless meta declares part: 'A' (part A of a split run ends after the
//   build; part B and every other level-2 or level-3 script still need one);
// - the script has no agent() call;
// - an agent() call has no explicit model or effort, or uses Fable without --allow-fable (the highest model only when the user asks for it);
// - a label is not `role:item · effort`, its role is not one of build, read, test, review, judge, verify, fix, or its effort
//   differs from the call's effort option;
// - an agent's prompt has no AUTHORITY block quoting the user's latest message;
// - meta has no `estimate` in minutes, no `tokens` estimate (the run's total, as planned), or no `agents` (the most agents the
//   run can launch, conditional ones included), or `agents` is fewer than the script's agent() calls;
// - the plan is over 60 minutes, 1.5 million tokens or 25 agents without `overrun` recording the user's permission and its
//   date (YYYY-MM-DD);
// - an --allow flag is used without `override` in meta recording the reason and the date (YYYY-MM-DD), with the user's words
//   if they asked for it;
// - a prompt that mentions captures has no `FRAMES:` list; a review, judge or verify prompt that mentions captures does
//   not say to reuse them;
// - any prompt runs a full suite without --allow-full-suite;
// - a prompt pastes a whole agent report with JSON.stringify(x) instead of the fields it needs (x.summary, x.musts) and the
//   report's file path, unless --allow-inline-report.
// Prompts are checked with their `${NAME}` constants expanded; comments inside meta are ignored.
// Usage: bun tools/workflow-lint.mjs <script.js> [--allow-fable] [--allow-full-suite] [--allow-inline-report]
import { readFileSync } from "node:fs";

const [path, ...flags] = process.argv.slice(2);
if (!path) {
  console.error("usage: bun tools/workflow-lint.mjs <script.js> [--allow-fable] [--allow-full-suite] [--allow-inline-report]");
  process.exit(2);
}
const allowFable = flags.includes("--allow-fable");
const allowFullSuite = flags.includes("--allow-full-suite");
const allowInlineReport = flags.includes("--allow-inline-report");
const src = readFileSync(path, "utf8");
const problems = [];
const ROLES = ["build", "read", "test", "review", "judge", "verify", "fix"];

// Each agent( ... ) call: find its options object, the last `{ label: ...}` object before the call's closing paren.
const calls = [];
for (let i = src.indexOf("agent("); i !== -1; i = src.indexOf("agent(", i + 6)) {
  if (/[\w.]/.test(src[i - 1] ?? "")) continue; // not a bare agent( call
  let depth = 0;
  let j = i + 5;
  for (; j < src.length; j++) {
    const c = src[j];
    if (c === "(") depth++;
    else if (c === ")") {
      depth--;
      if (depth === 0) break;
    } else if (c === "`") {
      // skip template literal, including nested ${ }
      let k = j + 1;
      let inner = 0;
      for (; k < src.length; k++) {
        if (src[k] === "\\") { k++; continue; }
        if (src[k] === "$" && src[k + 1] === "{") { inner++; k++; continue; }
        if (src[k] === "}" && inner > 0) { inner--; continue; }
        if (src[k] === "`" && inner === 0) break;
      }
      j = k;
    }
  }
  calls.push(src.slice(i, j + 1));
}
if (calls.length === 0) problems.push("no agent() calls found");

// Template constants (const NAME = `...`), expanded in prompts so rules in shared blocks are seen.
const consts = {};
for (const m of src.matchAll(/const (\w+) = `([\s\S]*?)`\n/g)) consts[m[1]] = m[2];
const expand = (t) => {
  for (let pass = 0; pass < 3; pass++) t = t.replace(/\$\{(\w+)\}/g, (all, k) => (k in consts ? consts[k] : all));
  return t;
};

calls.forEach((call, n) => {
  const optsAt = call.lastIndexOf("{ label:") >= 0 ? call.lastIndexOf("{ label:") : call.lastIndexOf("{");
  const opts = call.slice(optsAt);
  const label = /label:\s*(['"`])(.*?)\1/s.exec(opts)?.[2];
  const model = /model:\s*['"](\w+)['"]/.exec(opts)?.[1];
  const effort = /effort:\s*['"](\w+)['"]/.exec(opts)?.[1];
  const where = `agent #${n + 1}${label ? ` (${label})` : ""}`;
  if (!model) problems.push(`${where}: no explicit model`);
  if (model && /fable/i.test(model) && !allowFable) problems.push(`${where}: Fable model without --allow-fable`);
  if (!effort) problems.push(`${where}: no explicit effort`);
  if (!label) problems.push(`${where}: no label`);
  else {
    const m = /^([a-z][a-z0-9-]*):(\S.*?) · (low|medium|high|xhigh|max)$/.exec(label);
    if (!m) problems.push(`${where}: label is not "role:item · effort"`);
    else {
      const role = m[1];
      if (!ROLES.includes(role)) problems.push(`${where}: role "${role}" is not one of build, read, test, review, judge, verify, fix`);
      if (effort && m[3] !== effort) problems.push(`${where}: label effort "${m[3]}" differs from effort "${effort}"`);
    }
  }
  const role = label?.split(":")[0];
  const text = expand(call);
  if (!/AUTHORITY/.test(expand(optsAt > 0 ? call.slice(0, optsAt) : call))) problems.push(`${where}: no AUTHORITY block in its prompt`);
  const captures = /captur|screenshot/i.test(text);
  if (captures && !/FRAMES:/.test(text)) problems.push(`${where}: asks for captures without a FRAMES: list (only the states the change can affect; skipped states named with the reason)`);
  if (captures && ["review", "judge", "verify"].includes(role) && !/reuse/i.test(text)) problems.push(`${where}: a ${role} step must reuse the earlier captures and take only the missing frames`);
  if (/\bin full\b|full suite|full battery|whole suite|entire suite/i.test(text) && !allowFullSuite) problems.push(`${where}: full suite without --allow-full-suite (run only the checks for what changed)`);
  const whole = [...call.matchAll(/JSON\.stringify\(\s*([A-Za-z_$][\w$]*)\s*[,)]/g)].map((m) => m[1]);
  if (whole.length && !allowInlineReport) problems.push(`${where}: pastes whole report(s) ${whole.join(", ")} with JSON.stringify: pass the fields the step needs (e.g. ${whole[0]}.summary, ${whole[0]}.musts) and the report's file path, or --allow-inline-report`);
});

// Comments are dropped first, so a template comment that mentions `overrun:` does not count as the permission.
const meta = (/export const meta\s*=\s*\{([\s\S]*?)\n\}/.exec(src)?.[1] ?? "").replace(/\s\/\/ .*$/gm, "");
const estimate = Number(/estimate:\s*(\d+)/.exec(meta)?.[1]);
if (!estimate) problems.push("meta has no estimate (minutes)");
const tokens = Number(/tokens:\s*([\d_]+)/.exec(meta)?.[1]?.replace(/_/g, ""));
if (!tokens) problems.push("meta has no tokens estimate (the run's total, as planned; report the real figure after it ends)");
const agents = Number(/agents:\s*(\d+)/.exec(meta)?.[1]);
if (!agents) problems.push("meta has no agents estimate (the most agents the run can launch, conditional ones included)");
else if (agents < calls.length) problems.push(`meta.agents ${agents} is fewer than the ${calls.length} agent calls in the script`);
const quoted = (key) => new RegExp(`${key}:\\s*(['"\`])((?:\\\\[\\s\\S]|(?!\\1)[\\s\\S])*)\\1`).exec(meta)?.[2];
const overrun = quoted("overrun");
const over = [
  estimate > 60 && `estimate ${estimate} min is over 60`,
  tokens > 1_500_000 && `tokens ${tokens} is over 1.5 million`,
  agents > 25 && `agents ${agents} is over 25`,
].filter(Boolean);
if (over.length && !/\S/.test(overrun ?? "")) problems.push(`meta ${over.join(", ")}: ask the user for permission first and record it in meta.overrun (their words and the date)`);
else if (over.length && !/\b\d{4}-\d{2}-\d{2}\b/.test(overrun)) problems.push("meta.overrun has no date: quote the user's permission with the date (YYYY-MM-DD)");
const override = quoted("override");
const used = flags.filter((f) => ["--allow-fable", "--allow-full-suite", "--allow-inline-report"].includes(f));
if (used.length && !/\S/.test(override ?? "")) problems.push(`${used.join(", ")} without meta.override: record the reason and the date (YYYY-MM-DD), with the user's words if they asked for it`);
else if (used.length && !/\b\d{4}-\d{2}-\d{2}\b/.test(override)) problems.push("meta.override has no date: record the reason with the date (YYYY-MM-DD)");

const levelMatch = /level:\s*(\d)/.exec(meta);
const level = levelMatch ? Number(levelMatch[1]) : NaN;
const isPartA = /part:\s*['"`]A['"`]/.test(meta);
const roles = calls.map((c) => /label:\s*(['"`])([a-z][a-z0-9-]*):/.exec(c)?.[2]).filter(Boolean);
if (Number.isNaN(level) || level > 3) problems.push("meta has no level 0 to 3 (RULES.md, section 1): size it before launching");
else if (level === 0) problems.push("meta level 0 is trivial: do it in the main session, never as a workflow");
else if (level === 1) {
  const extra = roles.filter((r) => ["review", "judge", "verify", "fix"].includes(r));
  if (calls.length > 1) problems.push(`meta level 1 has ${calls.length} agents: one agent does the work and checks itself against the ask, the user judges the result`);
  if (extra.length) problems.push(`meta level 1 has ${extra.join(", ")} step(s): no review, judge, verify or fix at level 1`);
  if (estimate > 30) problems.push(`meta level 1 estimate ${estimate} min is over 30: cut it to the smallest piece that answers the user's message`);
} else if (!isPartA && !roles.some((r) => ["review", "judge", "verify"].includes(r))) {
  problems.push(`meta level ${level} has no review, judge or verify step: levels 2 and 3 are checked by a judge (only part A of a split run, declared with part: 'A' in meta, ends after the build)`);
}

if (!/export const meta\s*=\s*\{[\s\S]*?description:/.test(src)) problems.push("meta has no description");

if (problems.length) {
  console.error(`workflow-lint: ${problems.length} problem(s) in ${path}`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`workflow-lint: ok (${calls.length} agent calls) ${path}`);
