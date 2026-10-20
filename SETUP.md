# Setup: install the rules in a project

This file is for a Claude Code agent. The user asks for the install with one line:

> Install the agent workflow rules from https://github.com/creative-context/agent-workflow-rules in this project. Follow its SETUP.md.

Follow the steps in order. When you finish, the project has a copy of the rules, the lint and the template, a `CLAUDE.md` that points the main session to the rules and holds the project's own values, and a request list.

## 1. Ground rules

- **Work only in the current project.** Its root, `<root>` below, is the folder where you install. Run `git rev-parse --show-toplevel`. If the folder you were started in is not the root of the repository (the command prints another folder), ask the user where to install: in the folder you were started in, or at the root of the repository. Say what each choice affects. The folder you were started in keeps the install in that part of the repository, with its own `CLAUDE.md`, `docs/` and `tools/`. The root of the repository shares one install with every part of it. When the user cannot be asked, the safe choice is the folder you were started in: the report says so and asks the question. If the folder you were started in is the root of the repository, it is `<root>`. Outside a git repository, the folder you were started in is the project, and the report says so. Every project path in steps 3 to 7, in Updating and in Removing is under `<root>`, whichever folder you were started in: write it as `"<root>/..."` or run `cd "<root>"` first in the same command. The only thing you create outside the project is the temporary clone of step 2, and you delete it at the end.
- **Never overwrite an existing file without showing the difference and asking.** That includes `CLAUDE.md`, the three copies and the request list. Steps 3, 4 and 6 say what to do when something is already there.
- **When you cannot ask the user during the run, take the safe choice:** leave the existing file as it is, write the question in the report, and go on with the rest.
- **Do not commit** unless the user asks.
- **Never invent a value.** What you cannot find in the project goes in as `TBD` and is listed in the report.
- **Do not open `.env` or other files with secrets,** not even to look for a port. If a value is only there, write `TBD` and say where the user can look.
- **Quote every path in every command,** because a path can have spaces. The placeholders below are written that way, for example `"<clone>/RULES.md"`.

## 2. Get the files

- If the user gave a local copy of the repository, read it in place: no temporary folder, and nothing to delete afterwards. `<clone>` below is that folder.
- Otherwise, clone it into a temporary folder:

```bash
mktemp -d
git clone --depth 1 https://github.com/creative-context/agent-workflow-rules.git "<tmp>/agent-workflow-rules"
```

`<tmp>` is the folder `mktemp -d` printed. Shell variables do not carry over between commands, so write the path out each time. `<clone>` below is `<tmp>/agent-workflow-rules`.

If the clone fails, ask the user for a local copy (safe choice: stop and report). Do not run anything from `<clone>`. For the report, note the version, which is the first heading in `"<clone>/CHANGELOG.md"` (for example `## 0.6.1 · 2026-10-19`), and the commit, from `git -C "<clone>" rev-parse --short HEAD`. For a local copy, also note whether `git -C "<clone>" status --short` prints anything (uncommitted changes), or that it is not a git repository.

## 3. Copy the three files

Copy, do not link. Keep the copies unchanged, so that a later update can be a copy.

| From the repository | To the project (under `<root>`) |
|---|---|
| `RULES.md` | `docs/agent-workflow-rules.md` |
| `tools/workflow-lint.mjs` | `tools/workflow-lint.mjs` |
| `templates/level-2-archetype.js` | `tools/workflow-templates/level-2-archetype.js` |

- **If the destination is missing,** create its folder and copy the file: `mkdir -p "<root>/<folder>"`, then `cp "<clone>/<from>" "<root>/<to>"`, where `<folder>` is the folder part of `<to>`.
- **If it exists and is identical** (`cmp "<clone>/<from>" "<root>/<to>"` prints nothing), leave it.
- **If it exists and differs,** show the difference (`diff -u "<root>/<to>" "<clone>/<from>"`) and ask whether to replace it. Safe choice: keep the project's file. If the project's file stays, note it for step 4.
- The links inside the copied rules point to the repository's layout (for example `templates/level-2-archetype.js`). Leave them as they are: the project block in step 4 gives the real paths.

## 4. CLAUDE.md

The file is `"<root>/CLAUDE.md"`.

- **If it is missing,** create it with only the section below.
- **If it exists,** add the section at the end, after one blank line. If the file does not end with a line end, add one first, then one blank line, then the section. Nothing else in the file changes; the rest stays byte for byte.
- **If it already has an "Agents and workflows" section,** show it, never add a second one, and ask whether to replace it. Safe choice: leave it, and put the section you would have written in the report.
- **If the project has `AGENTS.md` but no `CLAUDE.md`,** create `CLAUDE.md` with the section, and ask whether it should also import `AGENTS.md` with a line that reads `@AGENTS.md`. Safe choice: leave that line out.

The heading is `##` when the file is new, has no sections or has only a `#` title. Otherwise it takes the level of the file's sections, for example `#` when the file has several `#` headings. The section looks like this; write it without the code fence:

```markdown
## Agents and workflows

Before launching agents or a workflow, the main session must read `docs/agent-workflow-rules.md`, a copy of agent-workflow-rules <version>, kept unchanged.

Seven checks before any launch: is it needed and at which level; intent in three lines; explicit model and effort on every agent, with the phase table; AUTHORITY, verbatim and dated; minimum FRAMES; an estimate in minutes and tokens, with permission past 60 minutes; the lint passes.

This is Appendix A of the rules for this project.

| What | In this project | Where it came from |
|---|---|---|
| Mechanical check of workflows | `node tools/workflow-lint.mjs <script.js>` (a copy; `bun` also works). Template: `tools/workflow-templates/level-2-archetype.js` | Copied by the setup |
| Living request list | … | … |
| Lock for builds and browsers (how it is taken, when it counts as abandoned) | … | … |
| Test suite, who owns it and how to filter it to one case | … | … |
| Dev server someone is watching (never restarted, never swept) | … | … |
| Built pages or deliverables | … | … |
| Where reused workflow scripts live | … | … |
| Decisions file | … | … |
| Verification workflow for deliverables to others | … | … |
```

- Do not import the rules with an `@docs/agent-workflow-rules.md` line. An import loads the rules into every call of every agent, and only the main session needs them: the agents get what they need in their prompts.
- Replace `<version>` with the version from step 2.
- If a file stayed different in step 3, add to the first row's last cell which file it is, for example "Copied by the setup; `tools/workflow-lint.mjs` kept different at the user's choice". The update in the Updating section reads this.

## 5. Fill in Appendix A

Fill in the table in the project block of `CLAUDE.md`, never in the copied rules. For each row, look for the value in the project and write where it came from (the file and, when it helps, the key or line).

- **Not found:** `TBD`, with "not found in <the places checked>" as its source, for example "not found in `package.json`, `Makefile`".
- **Partly found:** the known part plus "TBD: <what is missing>", for example "`npm test`; TBD: how to run one case".
- **Does not exist yet** (a scripts folder, a decisions file, a verification workflow): "none yet", with the places checked as its source and a suggested path in the report. Do not create the folder or file unless the user agrees.

| Row | Where to look |
|---|---|
| Living request list | An existing list of the user's requests (`REQUESTS.md` or similar). If there is none, `REQUESTS.md` from step 6. If a file may be one, see step 6 |
| Lock for builds and browsers | Scripts, docs or an existing `CLAUDE.md` that describe a shared lock for builds or browser runs. A package manager's lock file (`package-lock.json`, `bun.lock`, `poetry.lock`) is not this lock |
| Test suite, owner and one case | `package.json` scripts, `Makefile`, `pyproject.toml`, `go.mod`, `Cargo.toml` or similar for the test command; the runner it calls for how to run one case (for example a file and a test name). The owner from `CODEOWNERS` if it exists, otherwise `TBD` |
| Dev server | `.claude/launch.json` (the configuration's name and port), otherwise the `dev` or `start` script and the port its command or config sets |
| Built pages or deliverables | The build script and its output folder (for example `dist/`, `build/`, `out/`), or a folder of documents for others |
| Reused workflow scripts | An existing folder of Workflow scripts (files with `export const meta` and agent calls, not counting the files copied in step 3) |
| Decisions file | `DECISIONS.md`, `docs/decisions/`, `docs/adr/` or similar |
| Verification workflow for deliverables | An existing workflow script that verifies deliverables by source |

- **A value that comes from a tool's documented default or syntax, not from the project, names that source or is `TBD`.** Examples: a test runner's filter flag (`node:test` docs, not set in the project) or a build tool's default output folder (Vite docs, not set in the project). Do not cite only project files for such a value. Prefer `TBD` when you are not sure of the tool's behavior in this version.
- If a row has more than one candidate (two test commands, several packages), ask which one, or write each with its source if they all apply.
- The first row is already filled in by the setup.

## 6. The request list

- **If a file may already be the request list,** such as `TODO.md` or a tasks file, ask whether it is. Do not create `"<root>/REQUESTS.md"` until the user answers. Safe choice: create nothing, write "TBD: is `<file>` the request list?" in Appendix A, and put the install row in the report.
- **If the project has no request list,** create `"<root>/REQUESTS.md"`:

```markdown
# Requests

One row per message from the user, in the same turn. Progress reports come from this list.

Statuses: to do, in progress, done, answered, not verified.

| Date | The user's words | Ask | Status | Evidence |
|---|---|---|---|---|
```

Before step 7, add the install request as a row: today's date, the user's words verbatim, "Install the agent workflow rules", status `in progress`. After step 7, set it to `done` with the lint's output line as evidence, or to `not verified` with the reason. If any copy was kept different in step 3, the status is `not verified` and the reason names the kept files: a lint result from a kept-different lint does not count as a pass.

## 7. Verify

Run only these checks, from `<root>` (`cd "<root>"` first, in the same command as the checks, even if it is the folder you were started in). Do not run the project's own tests.

```bash
node "tools/workflow-lint.mjs" "tools/workflow-templates/level-2-archetype.js"
cmp "<clone>/RULES.md" "docs/agent-workflow-rules.md"
cmp "<clone>/tools/workflow-lint.mjs" "tools/workflow-lint.mjs"
cmp "<clone>/templates/level-2-archetype.js" "tools/workflow-templates/level-2-archetype.js"
grep -n 'read `docs/agent-workflow-rules.md`' "CLAUDE.md" && test -f "docs/agent-workflow-rules.md"
grep -n '^@docs/agent-workflow-rules.md' "CLAUDE.md"
git status --short
```

What a pass prints:

- **The lint:** a line that starts with `workflow-lint: ok`. If `tools/workflow-lint.mjs` was kept different in step 3, that line proves nothing about this version of the rules: report it as run with the project's older lint, not as a pass. If `node` is missing, use `bun`. If neither is installed, the lint is "not verified": say so in the report.
- **Each `cmp`:** nothing. For a file kept different in step 3, `cmp` prints where it differs: report that instead.
- **The first `grep`:** the line that tells the main session to read the rules, with its number; `test -f` prints nothing.
- **The second `grep`:** nothing, because there is no import line. If it prints one, report it: the rules load into every agent.
- If you left an existing section in step 4, report what both `grep` commands printed.
- **`git status --short`:** the changes for the report. Outside a git repository, list the files you wrote.

Then, if you cloned, delete the temporary folder: `rm -rf "<tmp>"`. Never delete a local copy the user gave.

## 8. Report to the user

Keep it short:

1. **Source and root:** the version and commit of the rules, whether a local copy had uncommitted changes, and the project root `<root>`: whether the user chose it, or you took the folder you were started in because you could not ask (outside git, that it is the folder you were started in).
2. **Files added or changed,** from `git status --short`, each with one line on what changed.
3. **Each Appendix A value** with where it came from.
4. **The TBDs and "none yet" values,** where the user might find each one, and a suggested path for each "none yet".
5. **The checks:** what each one printed.
6. **The questions you could not ask,** each with the safe choice you took.
7. **How to update later:** ask an agent "Update the agent workflow rules from https://github.com/creative-context/agent-workflow-rules in this project. Follow the Updating section of its SETUP.md."

## Updating

1. Get the files again (step 2) and read the new `CHANGELOG.md` entries since the version in the project block.
2. Before copying, run `diff -u "<root>/<project file>" "<clone>/<repository file>"` for each of the three files and show the user a short summary. Replace a file only when it is identical to the version the project block names, or the user agrees. Ask first when:
   - the project block's first row says a file was kept different at install, or
   - the file differs in a way the `CHANGELOG.md` does not explain (the user may have edited it).

   Then copy the files that were approved, to the same paths. Safe choice: keep the project's file. Report each file you left as it was.
3. Keep the project block in `CLAUDE.md`. Change only the version in it, and any row a changelog entry asks for. Before 0.7.0 the block imported the rules with an `@docs/agent-workflow-rules.md` line: show it and ask whether to replace it with the read line and the checks line of step 4. Safe choice: leave it, and say in the report that the import loads the rules into every call of every agent.
4. Run the checks in step 7 and report as in step 8.

## Removing

Every path here is under `<root>`, the folder where the setup installed (the project block in `CLAUDE.md` is in `"<root>/CLAUDE.md"`).

1. Delete `"<root>/docs/agent-workflow-rules.md"`, `"<root>/tools/workflow-lint.mjs"` and `"<root>/tools/workflow-templates/level-2-archetype.js"`, and the folders the setup created if they are empty.
2. Remove the "Agents and workflows" section from `"<root>/CLAUDE.md"`, with its read line (or, before 0.7.0, its `@docs/agent-workflow-rules.md` line). If the setup created `CLAUDE.md` and nothing else is in it, ask before deleting the file.
3. `"<root>/REQUESTS.md"` holds the user's history: ask before deleting it.
