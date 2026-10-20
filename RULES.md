# How to launch agents and workflows in Claude Code

A practical guide to splitting work across subagents in Claude Code without overspending or losing control. Each rule says what to do and how to apply it. Appendix A is a template for what is specific to your project.

The guide comes with `tools/workflow-lint.mjs`, which checks a workflow script before it launches: `bun tools/workflow-lint.mjs <script.js>` (it also runs with `node`). The template for a level-2 workflow is [templates/level-2-archetype.js](templates/level-2-archetype.js).

**Terms.** The *main session* is the Claude Code session the user talks to. A *workflow* is a script for Claude Code's Workflow tool that runs several agents in phases. A *must* is a finding that blocks "done".

---

## 0. Before launching: seven checks

1. **Is it needed?** Small things are done directly, in the main session. Which risk level is it? (section 1)
2. **Intent in three lines:** what kind of piece it is, who it is for and what it has to achieve. If it is not clear, ask first.
3. **Explicit model and effort on every agent**, and the phase table (model, effort and reason) shown in the reply before launching.
4. **AUTHORITY:** the user's latest message, verbatim and dated.
5. **Minimum FRAMES**, when there are captures: the framing the user used plus one risk state.
6. **Estimate in minutes and in tokens.** If a part needs more than 60 minutes, ask the user for permission to go past that limit before launching it.
7. **The lint passes.** If it fails, the workflow does not launch.

## 1. Verify by risk

| Level | What it is | Shape | How it is checked |
|---|---|---|---|
| 0 · Trivial | A word, a value, a label, anything reversible | Directly in the main session | One quick check from the main session: a test, a capture or a reread |
| 1 · Visual | Something the user will look at anyway: a board, a color, a framing, a sketch, a first draft | Directly, or a single agent that builds | No judge: send it and the user judges |
| 2 · Core | Work that other work builds on: shared code, data, a model, behavior, an analysis, a plan or a research synthesis | The archetype workflow (section 4) | One review-and-judge step against the ask, with tests, captures or sources as evidence |
| 3 · For others | Decks, data sheets, anything that leaves the team | The deliverables flow (section 5) | Critique, then verification by source |

- **Every workflow declares its level in `meta.level`.** Level 0 is never a workflow. Level 1 is a single agent that does the work and checks itself against the ask, with no review, judge or fix step, in 30 minutes at most. The lint enforces both. Part A of a split run (section 4) declares `part: 'A'` in `meta`; it ends after the build, so the lint accepts a level-2 or level-3 part A with no review, judge or verify step. Part B and every other level-2 or level-3 workflow still need one.
- **Size check before any workflow.** Three questions: which level is it, what is the least that answers the user's message, and what can the main session do in under 10 minutes. Whatever comes from what the user just sent (photos, crops, numbers, a measurement), the main session works out and hands to the agent as data. If the user names a source, use only that source.
- **If the user asks for speed, drop one level,** and say so in the launch line.
- **If the user asks to do it without agents, do it without agents.** That instruction wins over any session mode.
- **If the user asks a question, answer it before executing.** That includes questions that sound rhetorical, such as "do you follow me?". If their latest message can be read as "wait", launch nothing until they clarify.
- **Size it in one line:** the pieces, the model of each phase and the time, marked as an estimate. If a part needs more than 60 minutes, ask before launching it: run it whole, or split it so part A builds and stops with something the user can look at, and part B starts on their OK (part A declares `part: 'A'` in `meta`, section 4). If a step exists only out of habit, remove it and say so.

## 2. Which shape to use, by task

| Task | Level | Shape |
|---|---|---|
| Change to text, a label or a value | 0 | Direct. Targeted test or capture |
| Sketch, wireframe, board, mockup | 1 | Direct, in minutes, with the real labels. Capture to the user |
| Small visual tweak in the interface | 1 | Direct or one agent. Capture in the user's framing |
| Interface change with new behavior | 2 | Archetype. One judge checks both the view and the code |
| Change to data, a data model or core logic | 2 | Archetype, with the build on Opus at high |
| Research or code analysis | 2 | Sonnet readers in parallel, Opus synthesis and an Opus critic that tries to refute it |
| Analysis, plan or recommendation a decision rests on | 2 | Archetype. The build gives each claim its source; the judge checks claims, reasoning and gaps against the ask |
| Deck, data sheet or email with data for others | 3 | Deliverables flow (section 5) |
| Board or dashboard where every figure must come from data | 2 | First the analysis becomes datasets, with their judge; then the page is built |

## 3. Model and effort per step

| Model | What for |
|---|---|
| Haiku | Captures, renders, file checks, running tests and reporting, mechanical transformations and mappings. It does not read sources: that stays on Sonnet |
| Sonnet | Reading, extraction, search, shaping data into a schema, adopting existing files, bounded fixes |
| Opus | Planning, synthesis, writing that has to land, review and judging, design critique, design changes or hard logic |
| The highest model (Fable) | Only orchestrates in the main session, or runs when the user asks for it by name |

- **Effort is set per step when the workflow is planned,** by what the step does, and goes with its reason in the phase table. There is no default effort. As a guide:
  - low: mechanical work;
  - medium: reading code or documents where a missed detail costs rework;
  - high: planning, synthesis or building something hard.
- **Per piece, not per phase:** in a fan-out, each piece goes to the model its risk calls for. Mechanical work goes to Sonnet or Haiku; anything that can change the technical meaning goes to Opus.
- ⛔ **Explicit model on every agent,** inside a workflow and also for a standalone agent. If it is left out, the agent inherits the session's model and everything runs on the expensive one without warning.

## 4. The archetype workflow (level 2)

```
1. build              Opus at high, or Sonnet at medium, depending on the step
                      builds and returns changes, evidence and open items;
                      for analysis, each claim with its source
2. test               Haiku at low
                      runs the mechanical checks (syntax, tests for what changed,
                      calculations against the data, text scans) and reports them;
                      if the checks are a single command, the main session runs it
3. review and judge   Opus at medium, one agent
                      reads the test results and the evidence without redoing them,
                      tries to prove the work is not done, lists only real musts,
                      sets the status in the request list
4. fix                Sonnet at medium, only if there is a must
                      fixes and leaves its own evidence
5. main session       after a fix, reads the fix's diff and its check result;
                      launches a short Opus review at medium only if
                      those cannot settle a risky must
6. main session       opens the main evidence (a capture, a test result or the key sources),
                      confirms what changed and tells the user what matters
```

- **One judge per run.** One judge covers all the pieces of a run, unless they are large and independent.
- **The short review is not an agent.** After a fix, the main session reads the fix's diff and check result. It launches a short Opus review only if those cannot settle a risky must. A minor must is closed with the fix's own evidence, without another agent.
- At most two audit rounds, and the second only if the first found a must. Whatever is still open goes to the user.
- **If the checks are a single command (a script), the main session runs it and there is no test agent.** An agent spends tens of thousands of tokens before its first command: a test agent that ran one command used 71 thousand. In a workflow, part A ends after the build and declares `part: 'A'` in `meta`, so the lint accepts it with no review, judge or verify step; the main session runs the command, and part B, a second workflow, runs the review and judge and keeps its judge (section 9: a workflow that depends on another).
- **If the user says they will review it, drop the test and judge steps:** the build checks its own work against the ask, and the run becomes level 1 (one agent, 30 minutes at most). If the workflow is already running, stop it right after the build (section 9).
- **Evidence follows the work:** tests for code, captures for screens, sources and reasoning for research, analysis and plans. For analysis, the build returns each claim with its source, and the judge checks the claims, the reasoning and what is missing against the ask.
- **Review against the intent, not only against the reference.** The reference can be wrong too.

## 5. The deliverables flow (level 3)

For decks, data sheets and anything that leaves the team:

1. The workflow stops when the outline is done. The user approves titles and structure before anything is spent on verification and building.
2. Critique comes first, with two lenses in parallel: a reader with no context (understanding, argument, jargon) and a risk reader (risks, alternatives, cost, sales tone). Fix the structure.
3. Verification by source comes last:
   - claims are grouped by URL, and each page is opened once;
   - Sonnet extracts the exact text and Opus judges;
   - prices, limits, security, compliance and data residency get two independent Opus judges, and if they disagree, the claim stays out;
   - if a fix adds claims, verify only those, until no new ones appear.
4. In internal documents it is enough to compare each quote against the saved one, in a script and without agents. Only the quotes that do not match go on to reading and judging.
5. Data needs a source; your own analysis does not, but it is marked as analysis and has to be consistent with the data.

## 6. What every prompt carries

Each script defines a few shared blocks and pastes them into every `agent()` call:

1. **AUTHORITY:** the user's latest message, verbatim and dated, plus the context and the intent in three lines. It must say that the main session answers the chat and that a relayed message does not cancel the approved task.
2. **FRAMES:** the closed list of captures, only if there are any. By default, the framing the user used plus one risk state; skipped states are named with the reason. Reviewers and judges **reuse** the captures.
3. **RULES:**
   - never invent data: what is not known is "TBD", and analysis is marked as analysis;
   - never touch other projects, dependencies copied into the repo (`vendor/`) or files with secrets;
   - which files it may edit;
   - the shared lock for builds and browser runs;
   - targeted checks only;
   - read with few commands (section 7).
4. **TASK:** what this agent does and what it ends with.
5. **schema:** always structured output: summary, the path to its notes, changes, checks, evidence, open items.

An agent writes long deliverables to a file and returns a summary and the path.

## 7. Spend tokens on purpose

This rule wins over any session mode that says cost does not matter.

1. **Pass paths, not whole reports.** Each agent writes its notes to a file and returns the path. The next step gets only the fields it needs (summary, checks, musts) and that path. Never the whole report with `JSON.stringify(...)`.
2. **Images to measure:** crops of the area that matters, reduced scale when it is enough, one contact sheet instead of loose captures, and captures reused.
3. **Read in parts:** search with `grep` and read ranges. In the main session, trim outputs with `tail` or `cut`.
4. **Effort is set per step** (section 3).
5. **Estimate and report tokens like time:** `meta.tokens` when planning the workflow, and the real figures at the end, next to the minutes: the total and the tokens per model (Haiku, Sonnet, Opus), because their price per token differs a lot.
6. **What already saves:** verify by risk, review and judge in one, one judge per run, checks run once in the test step, and `resumeFromRunId` instead of running again.
7. **Mechanical work goes in a script, not an agent.** Resolving hundreds of `file:line` references, counting or cross-checking tables is done with a script, in the test step or in the main session. An agent that does it one item at a time multiplies the cost.
8. **Few commands per agent.** Every model call resends the agent's whole context, so read several files or line ranges in one command, not many small reads. Say so in the RULES block.
9. **Keep `CLAUDE.md` lean.** It rides in every call of every agent. Rules that only some steps need go in files those steps read, and the main session reads these rules there instead of importing them with `@`.
10. **Every agent has a fixed cost.** Before it does anything, an agent spends tens of thousands of tokens on its system prompt and tools. Measure your own: it depends on the tools and servers connected, whose definitions travel in every call. As a reference, one setup measured about 70 thousand in a run of three to five calls, much of it cache reads, which cost less. Count it in `meta.tokens`, and give a step to an agent only when its work is clearly worth more than that.

Keep a table of your own measured runs (agents, minutes, tokens) to estimate the next one from.

## 8. Checks

- **Only the checks for what changed,** and only once, in the test step. For code, run them with the suite's filter. The judge reads them and does not rerun them.
- **If the checks are a single command (a script), the main session runs it and there is no test agent:** an agent spends tens of thousands of tokens before its first command (a test agent that ran one command used 71 thousand). In a workflow, the run splits in two around the command (section 4).
- **The full suite only before a delivery to others or when something shared changes,** and say why.
- **Only one session at a time builds or runs tests.** Check with `ps` and the shared lock first.
- **A badly made check does not count as a pass.** If it fails, the judge decides whether the defect is in the work or in the check.
- **A new chart is seen drawn before it is delivered.** A judge that reads code confirms the numbers add up, not that the chart is understood. If the deliverable cannot be opened, build a local test with the chart and real data and take a capture. The question is whether someone with no context can say in one sentence what it shows. Be wary of:
  - logarithmic scales;
  - two different thresholds in the same chart;
  - sizes or colors without a legend;
  - many overlapping points.
  If it is not understood, change the form of the chart; adding notes that explain it does not fix it.
- **No code on screen without its name.** Internal classes, priorities or categories (A1, P0, "class B") are shown with their name in words, or a legend next to the chart explains them.

## 9. Mechanical check and operation

**Before launching:**

1. Write the script to a file and run `bun tools/workflow-lint.mjs <script.js>`. It checks exactly this:
   - `meta.description`;
   - `meta.level` from 0 to 3, with its limits: 0 is never a workflow; 1 is one agent with no review, judge, verify or fix step, in 30 minutes at most; 2 and 3 have at least one review, judge or verify step, except part A of a split run, which declares `part: 'A'` in `meta` and ends after the build (part B still needs the judge);
   - at least one `agent` call in the script;
   - explicit model and effort on every agent, and the highest model only with `--allow-fable`;
   - labels in the form `role:item · effort`, with a role from the list below and the same effort the agent runs at;
   - the AUTHORITY block in every agent's prompt;
   - `meta.estimate` in minutes, and, when it is over 60, `meta.overrun` with the user's permission and its date (YYYY-MM-DD);
   - `meta.tokens` with the estimated total;
   - the `FRAMES:` block when a prompt mentions captures, and the word "reuse" in review, judge and verify prompts;
   - no full suite in any prompt without `--allow-full-suite`;
   - no whole report pasted with `JSON.stringify(x)` of the whole object without `--allow-inline-report`: fields such as `x.summary` or `x.musts` are allowed.
2. Launch with `Workflow({ scriptPath })`.

**Naming and lint traps:**

- **Labels name the role, the piece and the effort:** `build:header · high`, `test:header-checks · low`, `review:header-judge · medium`. The role is one of `build`, `read`, `test`, `review`, `judge`, `verify` or `fix`, with `read` for the Sonnet readers of a research fan-out, so the run log shows who does what and at what effort.
- **Labels must be fixed text.** A `` `review:${x}` `` inside a `.map()` fails, so unroll the calls.
- **The block is literally called `FRAMES:`.**
- **A phrase such as "no full suites" triggers the full-suite rule:** write "targeted checks only".
- **The lint counts any `agent(` text inside a prompt as an agent:** do not write that word followed by a parenthesis in prompts.

**While it runs:**

- **A new request** is done in the main session if it is small and does not clash with what is running. If not, it is assigned to the specific step that will take it. Never "for the next agent" if that agent already started: agents read their files when they start.
- **If the new request touches the file the workflow is editing,** it goes to another workflow that only produces data, and the file is edited when the first one finishes. Before publishing something another step will edit, freeze a copy and publish from it.
- **To stop before a step without losing the one running:** a background watcher waits for that step's result in the workflow's `journal.jsonl`, then calls `TaskStop`.
- **To change a step that has not started:** stop after the previous one, edit only that step's prompt and relaunch with `resumeFromRunId`. Unchanged steps come from the cache; if the shared blocks change, every step runs again.
- **A workflow that depends on another** launches when the first one has finished and its output has been checked, never with a step that waits for some file to exist.
- **If someone is watching a dev server,** nobody sweeps values through live code or leaves a file that does not compile.

## 10. When it ends

1. **Read the result,** and the `journal.jsonl` if the summary is cut off. Open the main evidence and confirm what changed. Do not repeat what the judge already checked.
2. **Verify the key claims before treating them as done.** The user does not see what an agent reports.
   - **Secrets:** when checking them, print the type and the length, never the value, not even in a tool's output. A regex substitution that fails shows the value.
   - **Hypotheses:** a likely cause that could not be reproduced is presented as a hypothesis, and corrected in the chat if the fix shows another cause.
   - **What an agent did not open does not count as zero.** If it did not read a file (because of the secrets rule, its size or permissions), it reports it as "not verified", not as "0". The main session checks it with masked values.
   - **Page and data are published together.** Before publishing, check that every source the page reads exists and that none is left unused. Then publish the new data, the deletions and the page in one atomic batch, so nobody sees a page that reads sources that do not exist yet.
3. **"Done" only with evidence:** a capture in the same framing as the user's, the test that proves it or, for analysis, the sources behind each claim. If the user asked to copy something that exists, the evidence is a side-by-side comparison with the original. "Planned", "in the next round" or "noted" is not "done".
4. **Pass on what matters,** briefly: first the answer in one or two sentences, then the detail that is needed.
5. **Decisions are numbered and come with a recommendation, and they do not stop the work:** take the recommended one, note it and report it with its number so the user can change it. If there is a recommendation, do not ask "which one do you want?". Missing data is never inferred: it goes in as TBD or gets asked.
6. **Report the real minutes and tokens against the estimate,** with the figures, as they are: the total and the tokens per model (Haiku, Sonnet, Opus). Report the tokens per agent too: an agent that spent under about 1.3 times the fixed cost (about 90 thousand in that setup) did little more than that cost. Note that the step could join another or, if it was mechanical and short (a script, a command, reading a diff), that the main session could have done it, and apply it next time. Work that reads a lot stays in an agent even near the floor: the main session runs the most expensive model, and its context grows with everything it reads.
7. **Update the living request list** with each request's status and evidence.

## Request tracking

1. **One living request list.** Every message from the user goes into the project's list in the same turn, with their words, the ask and a status (to do, in progress, done, answered, not verified). Progress reports come from that list, never from memory.
2. **No request without an owner.** If it arrives while a workflow is running, it is assigned to the step that will take it, or done directly if it is small. The agent that fixes rereads the request list before it finishes and applies anything new that is its own.
3. **Short rounds,** of 45 to 60 minutes, with a delivery between one and the next. A longer round only with permission. A large job is split into deliveries.

---

## Template: the level-2 archetype

The template is a script for Claude Code's Workflow tool, in its own file: [templates/level-2-archetype.js](templates/level-2-archetype.js). It has the steps of section 4: build, test, review and judge in one, and a fix only when the judge finds a must. After a fix, the main session reads the fix's diff and check result instead of launching a recheck agent. Copy it, fill in every `…`, run the lint and show the phase table before launching.

---

## Appendix A. Your project's specifics

Fill in this table in each project, and copy the tools rather than linking them.

| What | In your project |
|---|---|
| Mechanical check of workflows | `tools/workflow-lint.mjs` (a copy) |
| Living request list | |
| Lock for builds and browsers (how it is taken, when it counts as abandoned) | |
| Test suite, who owns it and how to filter it to one case | |
| Dev server someone is watching (never restarted, never swept) | |
| Built pages or deliverables | |
| Where reused workflow scripts live | |
| Decisions file | |
| Verification workflow for deliverables to others | |

## Getting started

1. Copy this guide and `tools/workflow-lint.mjs` into your project, and fill in Appendix A. In `CLAUDE.md`, tell the main session to read the guide before launching agents; do not import it with `@`.
2. Create the living request list and log every message there.
3. Before each task, decide the level (section 1) and whether an agent is needed at all.
4. For a workflow, start from [templates/level-2-archetype.js](templates/level-2-archetype.js), pass the lint and show the phase table before launching.
5. When it ends, verify what matters, report the real minutes and tokens (the total and per model), and update the list.
