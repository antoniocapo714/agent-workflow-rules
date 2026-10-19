# Changelog

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
