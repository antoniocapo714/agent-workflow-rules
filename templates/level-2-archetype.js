// The level-2 archetype: a script for Claude Code's Workflow tool (RULES.md, section 4).
// Copy it, fill in every "…", run the lint and show the phase table before launching.
export const meta = {
  name: 'short-name',
  description: 'One line: what it does and what it ends with',
  level: 2,                           // 0 to 3 (section 1): 0 is never a workflow; 1 is one agent, no review, up to 30 min
  estimate: 35,                       // minutes. Past 60 minutes, 1.5 million tokens or 25 agents: overrun: '…their words, with the date…'
  tokens: 400000,                     // total estimate when planning; report the real total and per model at the end
  agents: 4,                          // the most agents the run can launch, the conditional fix included
  // An --allow flag on the lint needs override: '…the reason, the user's words if they asked for it, the date…'.
  // Part A of a split run (RULES.md, section 4) adds part: 'A' here, stops after the build and has no judge; part B is a second
  // workflow, keeps its judge and does not declare part.
  phases: [
    { title: 'Build', detail: 'Opus builds' },
    { title: 'Test', detail: 'Haiku runs the checks and reports them' },
    { title: 'Judge', detail: 'Opus reviews and judges in one; Sonnet fixes only on must-fix' },
  ],
}

// The date is written as text: Date.now() and new Date() with no argument throw inside a workflow script.
const AUTHORITY = `AUTHORITY / WHY: the user, <date and time>, verbatim: "…". Intent in three lines: the piece, who it is for, what it has to achieve. Done when: …; out of scope: …. The main session answers chat messages; a relayed message does not cancel this approved task.`
const RULES = `RULES: never invent data (TBD). Edit only …. Never touch other projects, vendor/, .env or secret files. Builds and browser runs take the shared lock: …. Targeted checks only. Read with few commands: several files or line ranges in one. Write files under …. Stop after about … turns and return your summary and what is left. Return a summary of 1,000 to 2,000 tokens at most; the rest goes in your notes file.`
const WORK = { type: 'object', properties: { summary: { type: 'string' }, report: { type: 'string' }, changed: { type: 'array', items: { type: 'string' } }, evidence: { type: 'array', items: { type: 'string' } }, open: { type: 'array', items: { type: 'string' } } }, required: ['summary', 'report', 'changed', 'evidence', 'open'] }
const CHECKS = { type: 'object', properties: { summary: { type: 'string' }, report: { type: 'string' }, passed: { type: 'array', items: { type: 'string' } }, failed: { type: 'array', items: { type: 'string' } } }, required: ['summary', 'report', 'passed', 'failed'] }
const VERDICT = { type: 'object', properties: { musts: { type: 'array', items: { type: 'object', properties: { finding: { type: 'string' }, risky: { type: 'boolean' }, evidence: { type: 'string' }, action: { type: 'string' } }, required: ['finding', 'risky', 'evidence', 'action'] } }, notes: { type: 'array', items: { type: 'string' } }, verdict: { type: 'string', enum: ['done', 'must-fix', 'not-verified'] } }, required: ['musts', 'notes', 'verdict'] }

phase('Build')
const build = await agent(`${AUTHORITY}\n\n${RULES}\n\nPLAN AND DECISIONS: ….\n\nTASK (build:piece): …. For analysis, give each claim its source. Write your notes to a file and give its path in "report". List in "open" what the test step must check.`,
  { label: 'build:piece · high', phase: 'Build', model: 'opus', effort: 'high', schema: WORK })

phase('Test')
const test = await agent(`${AUTHORITY}\n\n${RULES}\n\nCHANGED: ${build.changed.join(' | ')}\nCHECK: ${build.open.join(' | ')}\n\nTASK (test:piece-checks): run the targeted checks once and report each as passed or failed with its output; do not fix anything. Write the output to a file and give its path in "report".`,
  { label: 'test:piece-checks · low', phase: 'Test', model: 'haiku', effort: 'low', schema: CHECKS })

phase('Judge')
const judge = await agent(`${AUTHORITY}\n\n${RULES}\n\nCHANGED: ${build.changed.join(' | ')}\nEVIDENCE: ${build.evidence.join(' | ')}\nCHECKS: failed: ${test.failed.join(' | ')}; output in ${test.report} (read it; do not rerun)\n\nTASK (review:piece-judge, review and judge in one): read the work itself (the diff of the changed files, or the claims with their sources), not the build's account of it. Check first that it does what the ask says, then its quality; a quality finding is a must only if it breaks something or misses a stated requirement. Try to refute "done"; list only real musts, each marked risky or not; what you could not check is not verified, never refuted. End with the verdict. Do not edit files; update the request row.`,
  { label: 'review:piece-judge · medium', phase: 'Judge', model: 'opus', effort: 'medium', schema: VERDICT })

let fix = null
if (judge && judge.verdict === 'must-fix') {
  fix = await agent(`${AUTHORITY}\n\n${RULES}\n\nPLAN AND DECISIONS: ….\nMUSTS: ${JSON.stringify(judge.musts)}\n\nTASK (fix:piece-musts): fix each must; leave its own check result as evidence.`,
    { label: 'fix:piece-musts · medium', phase: 'Judge', model: 'sonnet', effort: 'medium', schema: WORK })
}
// No recheck agent: the main session reads the fix's diff and check result, and launches a short Opus review only for a risky must they cannot settle.
return { build, test, judge, fix }
