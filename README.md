<p align="center">
  <img src="docs/banner.png" alt="Agent workflow rules: the four risk levels, from a trivial edit checked once in the main session to work for other people verified by source" width="100%">
</p>

<h1 align="center">Agent workflow rules</h1>

<p align="center">
  How to launch agents and workflows in Claude Code:<br>
  size the work by risk, pick a model per step, check once, and spend tokens on purpose.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.4.0-2D72D2?labelColor=1A1D21" alt="Version 0.4.0">
  <img src="https://img.shields.io/badge/license-CC_BY_4.0-238551?labelColor=1A1D21" alt="CC BY 4.0 license">
  <img src="https://img.shields.io/badge/for-Claude_Code-8A8F98?labelColor=1A1D21" alt="For Claude Code">
</p>

<p align="center">
  <a href="RULES.md"><b>The rules</b></a> ·
  <a href="#getting-started"><b>Getting started</b></a> ·
  <a href="#the-lint"><b>The lint</b></a> ·
  <a href="CHANGELOG.md"><b>Changelog</b></a>
</p>

## Overview

A Claude Code session that can launch subagents and workflows tends to overbuild. Every change gets a judge, every fix gets another review, a fan-out inherits the session's model and runs everything on Opus, and nobody knows how long the run will take or how many tokens it will burn.

This guide makes the main session size the work before it launches anything, and verify each change according to its risk. It is one Markdown file, [`RULES.md`](RULES.md), plus a lint that checks a workflow script before it launches.

**What it does differently:**

- **Verification follows risk.** A trivial edit gets one quick check. A visual change or a first draft goes to the user, who judges it. Only work that other work builds on gets a judge, whether it is code, an analysis or a plan, and only work for other people gets verification by source.
- **Each step gets the model it needs.** Haiku runs the mechanical checks, Sonnet reads and fixes, and Opus builds and judges. Nothing inherits the session's model by accident.
- **Review and judge are one step.** One Opus agent reads the test results and the evidence and tries to prove the work is not done. A fix runs only if it finds a must.
- **Every run has a size.** Each workflow declares its level, minutes and tokens, and a part over 60 minutes needs the user's permission before it launches.
- **The user's words travel with the task.** Every prompt carries the user's latest message, verbatim, so a relayed message never derails an approved task.
- **"Done" means evidence:** a capture, a test result or, for analysis, the sources behind each claim. Not "planned" or "noted".

## The rules

| Section | What it covers |
|---|---|
| [0. Before launching](RULES.md#0-before-launching-seven-checks) | Seven checks before any agent starts |
| [1. Verify by risk](RULES.md#1-verify-by-risk) | Four levels, from a trivial edit to work for others |
| [2. Which shape to use](RULES.md#2-which-shape-to-use-by-task) | Task types mapped to a level and a shape |
| [3. Model and effort](RULES.md#3-model-and-effort-per-step) | Haiku, Sonnet and Opus, and effort per step |
| [4. The archetype workflow](RULES.md#4-the-archetype-workflow-level-2) | Build, test, review and judge, fix only if needed |
| [5. The deliverables flow](RULES.md#5-the-deliverables-flow-level-3) | Outline approval, two-lens critique, verification by source |
| [6. What every prompt carries](RULES.md#6-what-every-prompt-carries) | AUTHORITY, FRAMES, RULES, TASK and a schema |
| [7. Spend tokens on purpose](RULES.md#7-spend-tokens-on-purpose) | Paths instead of reports, measured images, scripts for mechanical work |
| [8. Checks](RULES.md#8-checks) | Targeted checks run once, charts seen drawn, codes shown with their names |
| [9. Mechanical check and operation](RULES.md#9-mechanical-check-and-operation) | The lint, naming, and how to stop or change a running workflow |
| [10. When it ends](RULES.md#10-when-it-ends) | Verify key claims, evidence, numbered decisions, real figures |
| [Request tracking](RULES.md#request-tracking) | One living request list, an owner for every request, short rounds |
| [Template](RULES.md#template-the-level-2-archetype) | The level-2 archetype as a workflow script |

## Getting started

1. **Copy `RULES.md` and `tools/workflow-lint.mjs` into your project.** Point Claude Code at the rules from your `CLAUDE.md`, for example with a line that reads `@RULES.md`.
2. **Fill in [Appendix A](RULES.md#appendix-a-your-projects-specifics)** with your project's request list, build lock, test suite and dev server.
3. **For each workflow,** start from the [template](RULES.md#template-the-level-2-archetype), run the lint, and show the phase table before launching.

## The lint

`tools/workflow-lint.mjs` checks a workflow script before it launches, and runs with `bun` or `node`:

```bash
bun tools/workflow-lint.mjs path/to/workflow.js
```

It fails when an agent has no explicit model or effort, a label is not `role:item · effort`, the AUTHORITY block is missing, `meta.level`, `meta.estimate` or `meta.tokens` is missing, a part runs over 60 minutes without the user's permission in `meta.overrun`, a prompt asks for captures without `FRAMES:`, or a prompt pastes a whole report. Three flags allow the exceptions the rules allow: `--allow-fable`, `--allow-full-suite` and `--allow-inline-report`.

## License

[CC BY 4.0](LICENSE). Share and adapt it, commercially too, with credit and a link to this repository.
