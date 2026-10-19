# Setup: install the rules in a project

This file is for a Claude Code agent. The user asks for the install with one line:

> Install the agent workflow rules from https://github.com/creative-context/agent-workflow-rules in this project. Follow its SETUP.md.

Follow the steps in order. When you finish, the project has a copy of the rules, the lint and the template, a `CLAUDE.md` that imports the rules and holds the project's own values, and a request list.

## 1. Ground rules

- **Work only in the current project.** The project is the folder you were started in. If that folder is inside a git repository whose root is elsewhere, ask which one to use. The only thing you create outside the project is the temporary clone of step 2, and you delete it at the end.
- **Never overwrite an existing file without showing the difference and asking.** That includes `CLAUDE.md`, the three copies and the request list.
- **Do not commit** unless the user asks.
- **Never invent a value.** What you cannot find in the project goes in as `TBD` and is listed in the report.
- **Do not open `.env` or other files with secrets,** not even to look for a port. If a value is only there, write `TBD` and say where the user can look.

## 2. Get the files

- If the user gave a local copy of the repository, use it.
- Otherwise, clone it into a temporary folder:

```bash
mktemp -d
git clone --depth 1 https://github.com/creative-context/agent-workflow-rules.git <tmp>/agent-workflow-rules
```

`<tmp>` is the folder `mktemp -d` printed. Shell variables do not carry over between commands, so write the path out each time. Below, `<clone>` is `<tmp>/agent-workflow-rules`, or the local copy.

If the clone fails, ask the user for a local copy. Do not run anything from the clone. Note the version: it is the first heading in its `CHANGELOG.md` (for example `## 0.6.0 · 2026-10-19`).

## 3. Copy the three files

Copy, do not link. Keep the copies unchanged, so that a later update can be a copy.

| From the repository | To the project |
|---|---|
| `RULES.md` | `docs/agent-workflow-rules.md` |
| `tools/workflow-lint.mjs` | `tools/workflow-lint.mjs` |
| `templates/level-2-archetype.js` | `tools/workflow-templates/level-2-archetype.js` |

- Create the folders if they are missing.
- If a destination file already exists and is identical (`cmp` says nothing), leave it.
- If it exists and differs, show the difference (`diff -u <project file> <clone>/<repository file>`) and ask before replacing it. If the user chooses to keep their file, keep it and note it for step 4.
- The links inside the copied rules point to the repository's layout (for example `templates/level-2-archetype.js`). Leave them as they are: the project block in step 4 gives the real paths.

## 4. CLAUDE.md

The file is `CLAUDE.md` at the project root.

- **If it is missing,** create it with only the section below.
- **If it exists,** add the section at the end and do not touch the rest.
- **If it already has a section called "Agents and workflows",** show it and ask before you change it.
- **If the project has `AGENTS.md` but no `CLAUDE.md`,** create `CLAUDE.md` with the section, and ask whether it should also import `AGENTS.md` with a line that reads `@AGENTS.md`.

Use the heading level the file already uses for its sections (`##` if the file is new). The section looks like this; write it without the code fence:

```markdown
## Agents and workflows

@docs/agent-workflow-rules.md

The rules above are a copy of agent-workflow-rules <version>, kept unchanged. This is their Appendix A for this project.

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

- The `@docs/agent-workflow-rules.md` line is plain text on its own line. Inside backticks or a code block, Claude Code does not import it.
- Replace `<version>` with the version from step 2.
- If the user chose to keep a different file in step 3, add to the first row's last cell which file it is, for example "Copied by the setup; `tools/workflow-lint.mjs` kept different at the user's choice". The update in the Updating section reads this.

## 5. Fill in Appendix A

Fill in the table in the project block of `CLAUDE.md`, never in the copied rules. For each row, look for the value in the project and write where it came from (the file and, when it helps, the key or line). What you do not find is `TBD`, and it goes in the report.

| Row | Where to look |
|---|---|
| Living request list | An existing list of the user's requests (`REQUESTS.md` or similar). If there is none, `REQUESTS.md` from step 6. If you find something that may be one, ask before using it |
| Lock for builds and browsers | Scripts, docs or an existing `CLAUDE.md` that describe a shared lock for builds or browser runs. A package manager's lock file (`package-lock.json`, `bun.lock`, `poetry.lock`) is not this lock |
| Test suite, owner and one case | `package.json` scripts, `Makefile`, `pyproject.toml`, `go.mod`, `Cargo.toml` or similar for the test command; the runner it calls for how to run one case (for example a file and a test name). The owner from `CODEOWNERS` if it exists, otherwise `TBD` |
| Dev server | `.claude/launch.json` (the configuration's name and port), otherwise the `dev` or `start` script and the port its command or config sets |
| Built pages or deliverables | The build script and its output folder (for example `dist/`, `build/`, `out/`), or a folder of documents for others |
| Reused workflow scripts | An existing folder of Workflow scripts (files with `export const meta` and agent calls) |
| Decisions file | `DECISIONS.md`, `docs/decisions/`, `docs/adr/` or similar |
| Verification workflow for deliverables | An existing workflow script that verifies deliverables by source |

- **A value that comes from a tool's documented default or syntax, not from the project, names that source or is `TBD`.** Examples: a test runner's filter flag (`node:test` docs, not set in the project) or a build tool's default output folder (Vite docs, not set in the project). Do not cite only project files for such a value. Prefer `TBD` when you are not sure of the tool's behavior in this version.
- If a row has more than one candidate (two test commands, several packages), ask which one, or write each with its source if they all apply.
- The first row is already filled in by the setup.

## 6. The request list

If the project has no request list, create `REQUESTS.md`:

```markdown
# Requests

One row per message from the user, in the same turn. Progress reports come from this list.

Statuses: to do, in progress, done, answered, not verified.

| Date | The user's words | Ask | Status | Evidence |
|---|---|---|---|---|
```

Add the install request as the first row: today's date, the user's words verbatim, "Install the agent workflow rules", and the status and evidence once step 7 has run (`done`, with the lint's output line).

## 7. Verify

Run these from the project root:

```bash
node tools/workflow-lint.mjs tools/workflow-templates/level-2-archetype.js
cmp <clone>/RULES.md docs/agent-workflow-rules.md
cmp <clone>/tools/workflow-lint.mjs tools/workflow-lint.mjs
cmp <clone>/templates/level-2-archetype.js tools/workflow-templates/level-2-archetype.js
grep -n '^@docs/agent-workflow-rules.md$' CLAUDE.md && test -f docs/agent-workflow-rules.md
```

- The lint must print a line that starts with `workflow-lint: ok`. If `node` is missing, use `bun`. If neither is installed, the lint is "not verified": say so in the report.
- Each `cmp` must print nothing: the copies are identical to the repository. If the user chose to keep a different file in step 3, report that instead.
- The `grep` must find the import line, and the file it points to must exist.
- Then delete the temporary folder, `rm -rf <tmp>`, if you cloned. Never delete a local copy the user gave.

## 8. Report to the user

Keep it short:

1. **Files added or changed,** each with one line on what changed.
2. **Each Appendix A value** with where it came from.
3. **The TBDs left to fill,** and where the user might find each one.
4. **The checks:** the lint's output line and the result of the import check.
5. **How to update later:** ask an agent "Update the agent workflow rules from https://github.com/creative-context/agent-workflow-rules in this project. Follow the Updating section of its SETUP.md."

## Updating

1. Get the files again (step 2) and read the new `CHANGELOG.md` entries since the version in the project block.
2. Before copying, run `diff -u <project file> <clone>/<repository file>` for each of the three files and show the user a short summary. Replace a file only when it is identical to the version the project block names, or the user agrees. Ask first when:
   - the project block's first row says a file was kept different at install, or
   - the file differs in a way the `CHANGELOG.md` does not explain (the user may have edited it).

   Then copy the files that were approved, to the same paths. Report each file you left as it was.
3. Keep the project block in `CLAUDE.md`. Change only the version in it, and any row a changelog entry asks for.
4. Run the checks in step 7 and report as in step 8.

## Removing

1. Delete `docs/agent-workflow-rules.md`, `tools/workflow-lint.mjs` and `tools/workflow-templates/level-2-archetype.js`, and the folders the setup created if they are empty.
2. Remove the "Agents and workflows" section from `CLAUDE.md`. If the setup created `CLAUDE.md` and nothing else is in it, ask before deleting the file.
3. `REQUESTS.md` holds the user's history: ask before deleting it.
