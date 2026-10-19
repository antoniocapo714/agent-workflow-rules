#!/usr/bin/env bun
// Checks a workflow script for Claude Code's Workflow tool before it is launched (see RULES.md, section 9). Fails when:
// - an agent() call has no explicit model, or uses Fable without --allow-fable (the highest model only when the user asks for it);
// - a label is not `role:item · effort`, or its effort differs from the call's effort option;
// - the script has no AUTHORITY block quoting the user's latest message;
// - the meta block has no description;
// - meta has no `estimate` in minutes, or it is over 60 without `overrun`
//   recording the user's permission; a prompt that asks for captures has no `FRAMES:` list; a review, judge or verify prompt that
//   mentions captures does not say to reuse them; a test prompt runs a full suite without --allow-full-suite.
// - (token use) meta has no `tokens` estimate (the run's total, as planned); a prompt
//   pastes a whole agent report with JSON.stringify(x) instead of the fields it needs (x.summary, x.musts) and the report's
//   file path, unless --allow-inline-report.
// - meta has no `level` 0 to 3; level 0 (trivial) is a workflow at all; level 1 (a sketch, a board, a frame the user
//   judges) has more than one agent, a review, judge, verify or fix step, or an estimate over 30 minutes.
// Prompts are checked with their `${NAME}` constants expanded.
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
  const opts = call.slice(call.lastIndexOf("{ label:") >= 0 ? call.lastIndexOf("{ label:") : call.lastIndexOf("{"));
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
    else if (effort && m[3] !== effort) problems.push(`${where}: label effort "${m[3]}" differs from effort "${effort}"`);
  }
  const role = label?.split(":")[0];
  const text = expand(call);
  const captures = /captur|screenshot/i.test(text);
  if (captures && !/FRAMES:/.test(text)) problems.push(`${where}: asks for captures without a FRAMES: list (only the states the change can affect; skipped states named with the reason)`);
  if (captures && ["review", "judge", "verify"].includes(role) && !/reuse/i.test(text)) problems.push(`${where}: a ${role} step must reuse the earlier captures and take only the missing frames`);
  if (role === "test" && /\bin full\b|full suite|full battery|whole suite|entire suite/i.test(text) && !allowFullSuite) problems.push(`${where}: full suite without --allow-full-suite (run only the checks for what changed)`);
  const whole = [...call.matchAll(/JSON\.stringify\(\s*([A-Za-z_$][\w$]*)\s*[,)]/g)].map((m) => m[1]);
  if (whole.length && !allowInlineReport) problems.push(`${where}: pastes whole report(s) ${whole.join(", ")} with JSON.stringify: pass the fields the step needs (e.g. ${whole[0]}.summary, ${whole[0]}.musts) and the report's file path, or --allow-inline-report`);
});

// Comments are dropped first, so a template comment that mentions `overrun:` does not count as the permission.
const meta = (/export const meta\s*=\s*\{([\s\S]*?)\n\}/.exec(src)?.[1] ?? "").replace(/\s\/\/ .*$/gm, "");
const estimate = Number(/estimate:\s*(\d+)/.exec(meta)?.[1]);
if (!estimate) problems.push("meta has no estimate (minutes)");
if (!Number(/tokens:\s*([\d_]+)/.exec(meta)?.[1]?.replace(/_/g, ""))) problems.push("meta has no tokens estimate (the run's total, as planned; report the real figure after it ends)");
if (estimate > 60 && !/overrun:\s*['"`]\S/.test(meta)) problems.push(`meta estimate ${estimate} min is over 60: ask the user for permission first and record it in meta.overrun (their words and the date)`);

const levelMatch = /level:\s*(\d)/.exec(meta);
const level = levelMatch ? Number(levelMatch[1]) : NaN;
if (Number.isNaN(level) || level > 3) problems.push("meta has no level 0 to 3 (RULES.md, section 1): size it before launching");
else if (level === 0) problems.push("meta level 0 is trivial: do it in the main session, never as a workflow");
else if (level === 1) {
  const roles = calls.map((c) => /label:\s*(['"`])([a-z][a-z0-9-]*):/.exec(c)?.[2]).filter(Boolean);
  const extra = roles.filter((r) => ["review", "judge", "verify", "fix"].includes(r));
  if (calls.length > 1) problems.push(`meta level 1 has ${calls.length} agents: one agent does the work and checks itself against the ask, the user judges the result`);
  if (extra.length) problems.push(`meta level 1 has ${extra.join(", ")} step(s): no review, judge or fix at level 1`);
  if (estimate > 30) problems.push(`meta level 1 estimate ${estimate} min is over 30: cut it to the smallest piece that answers the user's message`);
}

if (!/AUTHORITY/.test(src)) problems.push("no AUTHORITY block quoting the user's latest message");
if (!/export const meta\s*=\s*\{[\s\S]*?description:/.test(src)) problems.push("meta has no description");

if (problems.length) {
  console.error(`workflow-lint: ${problems.length} problem(s) in ${path}`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`workflow-lint: ok (${calls.length} agent calls) ${path}`);
