# Working on this repository

This file is for an agent that works on this repository. To install the rules in another project, follow [SETUP.md](SETUP.md) instead.

## What it is

A guide for launching agents and workflows in Claude Code: one Markdown file of rules, a lint that checks a workflow script before it launches, and a workflow template. There is no build and no package. The lint runs with `node` or `bun`.

## Layout

| Path | What it is |
|---|---|
| `RULES.md` | The rules, sections 0 to 10, request tracking and Appendix A |
| `tools/workflow-lint.mjs` | The lint for workflow scripts (section 9) |
| `templates/level-2-archetype.js` | The level-2 archetype, a Workflow script ready to copy |
| `SETUP.md` | How an agent installs the rules in a project |
| `README.md` | The overview, the rules table, getting started and the lint |
| `CHANGELOG.md` | One entry per version |
| `docs/banner.html`, `docs/banner.png` | The README banner and its source |
| `AGENTS.md` | This file. `CLAUDE.md` imports it |
| `LICENSE` | CC BY 4.0 |

## Commands

The lint on the template (it must pass):

```bash
node tools/workflow-lint.mjs templates/level-2-archetype.js
```

The banner, rendered from its source at 3x with headless Chrome (the command is also in the comment at the top of `docs/banner.html`):

```bash
chrome --headless=new --hide-scrollbars --force-device-scale-factor=3 --window-size=880,440 \
  --screenshot=docs/banner.png docs/banner.html
```

## Rules

- **The lint and section 9 change together.** The checklist in section 9 of `RULES.md`, the comment at the top of `tools/workflow-lint.mjs` and the lint's messages describe the same checks. Change them in the same commit. When a doc quotes a lint message, quote it exactly. The paragraph under "The lint" in `README.md` lists the same checks and changes with them.
- **The template always passes the lint.** Run the lint on it after any change to the template or the lint.
- **The README rules table matches `RULES.md`.** Each row links to a heading in `RULES.md`, and its anchor must match that heading: lowercase, punctuation removed, spaces turned into hyphens (for example `#0-before-launching-seven-checks`). If a heading changes, change its row.
- **The paths in `SETUP.md` match the repository layout.** If a file moves or is renamed, update `SETUP.md` in the same commit.
- **The version badge and the changelog move together.** A new version changes the badge in `README.md` (its text and its alt text) and adds an entry at the top of `CHANGELOG.md`.
- **American English, short and plain.**
- **No names of people, companies or projects** in the files.
- **Commits** use the account's GitHub noreply address as author and committer, dates in UTC (for example, run `git commit` with `TZ=UTC`) and no co-author trailers.

## Lint traps

From section 9 of `RULES.md`. They matter when you edit the template or write an example script:

- **Labels name the role, the piece and the effort,** as `role:item · effort`, with a role from `build`, `read`, `test`, `review`, `judge`, `verify` or `fix`, and the same effort the agent runs at.
- **Labels must be fixed text.** A label built with `${...}` inside a `.map()` fails, so unroll the calls.
- **The block is literally called `FRAMES:`.**
- **A phrase such as "no full suites" triggers the full-suite rule.** Write "targeted checks only". The lint also matches "in full", "full battery", "whole suite" and "entire suite".
- **The lint counts the word agent followed by an opening parenthesis as an agent call,** even inside a prompt. Do not write it in prompts.
