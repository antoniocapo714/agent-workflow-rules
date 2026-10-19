# Changelog

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
