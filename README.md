<p align="center">
  <img src="docs/banner.png" alt="Agent workflow rules: the four risk levels, from a trivial edit checked with one test to work for other people verified by source" width="100%">
</p>

<h1 align="center">Agent workflow rules</h1>

<p align="center">
  Rules for an AI agent that runs other agents:<br>
  size the work by risk, pick a model per step, check once, and spend tokens on purpose.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.2.0-2D72D2?labelColor=1A1D21" alt="Version 0.2.0">
  <img src="https://img.shields.io/badge/license-CC_BY_4.0-238551?labelColor=1A1D21" alt="CC BY 4.0 license">
  <img src="https://img.shields.io/badge/works_with-any_agent-8A8F98?labelColor=1A1D21" alt="Works with any agent">
</p>

<p align="center">
  <a href="RULES.md"><b>The rules</b></a> ·
  <a href="#getting-started"><b>Getting started</b></a> ·
  <a href="CHANGELOG.md"><b>Changelog</b></a>
</p>

## Overview

An agent that can launch other agents tends to overbuild. Every change gets a judge, every fix gets another review, a fan-out inherits the most expensive model, and nobody knows how long the run will take or how many tokens it will burn.

These rules make the main session size the work before it launches anything, and verify each change according to its risk. They are one Markdown file, [`RULES.md`](RULES.md), and they work with any agent tool, any model provider and any project.

**What they do differently:**

- **Verification follows risk.** A trivial edit gets one quick check. A visual change or a first draft goes to the user, who judges it. Only work that other work builds on gets a judge, whether it is code, an analysis or a plan, and only work for other people gets verification by source.
- **Review and judge are one step.** One top-model agent reads the build's test results, reuses its captures and tries to prove the work is not done. A fix runs only if it finds a must.
- **Every agent names its model.** Mechanical work goes to the small model, reading to the mid model, and judgment to the top model. Nothing inherits the session's model by accident.
- **Every run has a size.** Each part is estimated in minutes and tokens, and a part over 60 minutes needs the user's permission before it launches.
- **The user's words travel with the task.** Every prompt carries the user's latest message, verbatim, so a relayed message never derails an approved task.
- **"Done" means evidence.** A capture in the same framing as the user's screenshot, not "planned" or "noted".

## The rules

| Section | What it covers |
|---|---|
| [0. Before launching](RULES.md#0-before-launching-seven-checks) | Seven checks before any agent starts |
| [1. Verify by risk](RULES.md#1-verify-by-risk) | Four levels, from a trivial edit to work for others |
| [2. Which shape to use](RULES.md#2-which-shape-to-use-by-task) | Task types mapped to a level and a shape |
| [3. Model and effort](RULES.md#3-model-and-effort-per-phase) | Small, mid and top model, and effort per phase |
| [4. The archetype workflow](RULES.md#4-the-archetype-workflow-level-2) | Build, review and judge, fix only if needed |
| [5. The deliverables flow](RULES.md#5-the-deliverables-flow-level-3) | Outline approval, critique, then verification by source |
| [6. What every prompt carries](RULES.md#6-what-every-prompt-carries) | AUTHORITY, FRAMES, RULES, TASK and a schema |
| [7. Spend tokens on purpose](RULES.md#7-spend-tokens-on-purpose) | Paths instead of reports, measured images, estimates against real figures |
| [8. Tests](RULES.md#8-tests) | Targeted tests, run once |
| [9. Mechanical check and operation](RULES.md#9-mechanical-check-and-operation) | The pre-launch checklist, and how to stop or change a running workflow |
| [10. When it ends](RULES.md#10-when-it-ends) | Evidence, a short report, real figures against the estimate |

## Getting started

1. **Give the rules to the agent.** Paste `RULES.md` at the start of a session, or save it in the project and point your agent's instructions file at it (`AGENTS.md`, `CLAUDE.md` or your tool's rules folder).
2. **Add your project's specifics** in a short block next to it. The rules refer to these by role:

   | The rules mention | Tell the agent |
   |---|---|
   | Model tiers | Your provider's small, mid and top models, and the premium tier if there is one |
   | The request list | The file where requests are logged, for example `REQUESTS.md` |
   | The shared lock | How builds and browser runs take turns. For example, a directory created with `mkdir` and removed when the run ends, failed runs included, and treated as abandoned after 30 minutes |
   | The suite's filter | The command that runs only the tests for one change |
   | The dev server the user watches | Its address, and that nobody restarts it |
   | The mechanical check | Your linter command, if you have one |

3. **Keep the rules as they are** and put exceptions in your project block, so updating `RULES.md` stays a plain copy.

## License

[CC BY 4.0](LICENSE). Share and adapt them, commercially too, with credit and a link to this repository.
