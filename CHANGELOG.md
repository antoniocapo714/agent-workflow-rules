# Changelog

## 0.7.1 · 2026-10-20

- `SETUP.md`, step 7: the check for a leftover import line is now `! grep -n '^@docs/agent-workflow-rules.md' "CLAUDE.md"`. The old line exited with status 1 when there was no import line, which is the passing case, and stopped a chained run on a correct install. It now prints nothing and exits 0 when there is no import line.

## 0.7.0 · 2026-10-20

Fewer tokens per call and fewer agents per run:

- `CLAUDE.md` no longer imports the rules with `@docs/agent-workflow-rules.md`. Its section tells the main session to read `docs/agent-workflow-rules.md` before launching agents or a workflow, lists the seven checks and holds the project block. An import loads the rules into every call of every agent, and only the main session needs them. `SETUP.md` and the README's getting started follow; the verify step checks the read line and that there is no import, and Updating asks before replacing an older import line.
- Section 4: one judge per run, covering all its pieces unless they are large and independent. The short review after a fix is no longer an agent: the main session reads the fix's diff and check result, and launches a short Opus review only if those cannot settle a risky must. The template drops its recheck agent.
- Section 7: few commands per agent, because every model call resends the agent's whole context; and a lean `CLAUDE.md`, because it rides in every call of every agent.
- Sections 7 and 10: report the real tokens per model (Haiku, Sonnet, Opus) as well as the total.

## 0.6.2 · 2026-10-20

- The README has a diagram of the flow from a request to done: the seven checks, the four levels with the model for each step, and what happens at the end. Its source is `docs/flow.html`.

## 0.6.1 · 2026-10-19

`SETUP.md` leaves less to guess and handles files the project already has:

- If the folder the agent was started in is not the root of the repository, it asks where to install, in the folder it was started in or at the root, and says what each choice affects. When the user cannot be asked, it uses the folder it was started in, and the report says so and asks the question. Outside a git repository, the folder it was started in is the project.
- Whichever folder the user picks, every project path in the copy, request list, verify, update and remove steps is under `<root>`, so choosing the repository root when started in a subfolder puts the copies, `CLAUDE.md` and `REQUESTS.md` all in the root.
- In `CLAUDE.md`, if the file does not end with a line end, the agent adds one first, then one blank line, then the section; nothing else in the file changes.
- Every path in every command is quoted, placeholders included.
- A local copy of the repository is read in place, with no temporary folder. The report names its commit and says if it has uncommitted changes.
- The section in `CLAUDE.md` uses `##` when the file has only a `#` title or no sections, and otherwise the level of its sections. It goes after one blank line.
- In Appendix A, a partly known value is the known part plus "TBD: <what is missing>", and a `TBD` row gives "not found in <the places checked>" as its source.
- A value that does not exist yet is "none yet", with a suggested path in the report. The setup does not create it unless the user agrees.
- The install row in the request list is "in progress" before the checks and "done", with its evidence, after them.
- Each check says what a pass prints. The setup does not run the project's own tests, and lists the changes with `git status --short`.
- When the user cannot be asked during the run, the agent takes the safe choice: it leaves the existing file as it is, writes the question in the report and goes on.
- Conflicts and their safe choice: an existing "Agents and workflows" section is shown and never added twice; a different copy of the rules, the lint or the template is shown as a diff and kept; a file that may be the request list, such as `TODO.md`, is asked about before `REQUESTS.md` is created.
- If any copy was kept different, the install row is `not verified` and names the kept files; a lint result from a kept-different lint is not a pass.
- "none yet" also covers a missing verification workflow; the search for reused workflow scripts ignores the files copied in step 3.

## 0.6.0 · 2026-10-19

- `SETUP.md` tells a Claude Code agent how to install the rules in the project it works in: copy the rules, the lint and the template unchanged, add an "Agents and workflows" section to `CLAUDE.md` with Appendix A filled in from the project and each value's source, create the request list, run the lint and report. It also covers updating and removing.
- `AGENTS.md` is for an agent working on this repository: the layout, the commands and the rules that keep the files in step. `CLAUDE.md` imports it.
- The README's getting started has an "AI assistants" part with the one-line request, and its step 1 uses the same three paths and the `@docs/agent-workflow-rules.md` import as `SETUP.md`.
- Updating shows the difference for each file and asks before replacing one the user kept different or edited; the first row of the project block records a file kept at install.
- A value that comes from a tool's documented default or syntax, not from the project, names that source or is `TBD`.

## 0.5.0 · 2026-10-19

- The template is its own file, `templates/level-2-archetype.js`. RULES.md and the README link to it, and the README runs the lint on it.
- If the user says they will review the work, the test and judge steps are dropped too: the build checks itself and the run becomes level 1.
- If the checks are a single command, the main session runs it and there is no test agent. In a workflow, part A ends after the build and part B runs the review and judge. Part A declares `part: 'A'` in `meta` and the lint accepts it with no review, judge or verify step; part B and every other level-2 or level-3 workflow still need one.
- Data residency gets two independent Opus judges, like prices, limits, security and compliance. If a fix adds claims, only those are verified, until no new ones appear.
- At most two audit rounds, and the second only if the first found a must. The agent that fixes rereads the request list before it finishes. A request to copy something is closed with a side-by-side comparison with the original.
- The lint: levels 2 and 3 need a review, judge or verify step; the AUTHORITY block is checked in every agent's prompt; the role must be one of build, read, test, review, judge, verify or fix; `meta.overrun` needs a date (YYYY-MM-DD); and the full-suite rule applies to every role.
- The lint also fails a script with no agent call, and section 9 lists it.
- Section 9 lists exactly what the lint checks, and the roles include `read` for the readers of a research fan-out.

## 0.4.0 · 2026-10-19

- The guide is now specific to Claude Code: Haiku, Sonnet and Opus by name, the Workflow tool, `resumeFromRunId`, `journal.jsonl` and `TaskStop`.
- `tools/workflow-lint.mjs` checks a workflow script before it launches. Comments in `meta` no longer count as the permission to go over 60 minutes.
- The archetype gets a Haiku test step between the build and the judge.
- New: naming and lint traps, request tracking, charts seen drawn, codes shown with their names, secrets checked by type and length, what an agent did not open reported as not verified, page and data published together, numbered decisions with a recommendation, Appendix A and getting started.
- The two critique lenses say what each one reads for.

## 0.3.0 · 2026-10-19

- The archetype and the checks speak of evidence: tests for code, captures for screens, sources for analysis. Section 8 is now "Checks".
- "Done" for analysis means the sources behind each claim.
- Template: the level-2 archetype as a Claude Code workflow script, marked as Claude Code only.

## 0.2.0 · 2026-10-19

- A part estimated over 60 minutes asks the user for permission before it launches, instead of being split by default.
- Level 2 is now "Core": work that other work builds on, with or without code. Analyses, plans and research are checked against sources instead of tests and captures.

## 0.1.0 · 2026-10-19

- Sections 0 to 10: before launching, verify by risk, shapes by task, model and effort, the archetype workflow, the deliverables flow, prompt blocks, tokens, tests, the mechanical check, and when it ends.
- Model tiers are small, mid and top, mapped to your provider's models.
- The mechanical check is a checklist, with or without a linter.
- README banner, drawn at the size GitHub shows it (`docs/banner.html`).
