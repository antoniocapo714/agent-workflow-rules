# How to launch agents and workflows

Rules for an AI agent that runs other agents. They work with any agent tool and any project: paste them at the start of a session, or save them in the project's instructions file.

**Terms.** The *main session* is the agent the user talks to. A *workflow* is a script or plan that runs several agents in phases. A *must* is a finding that blocks "done". *Model tiers* are small, mid and top (for example Claude Haiku, Sonnet and Opus); map them to your provider's models.

---

## 0. Before launching: seven checks

1. **Is it needed?** Small things are done directly. Which risk level is it (section 1)?
2. **Intent in three lines:** what kind of piece it is, who it is for and what it has to achieve.
3. **Model and effort set explicitly on every agent**, and the table of model and effort per phase shown in the reply.
4. **AUTHORITY:** the user's latest message, verbatim and dated.
5. **Minimum FRAMES** when there are captures: the framing the user used, plus one risk state.
6. **Estimate in minutes and in tokens.** If a part needs more than 60 minutes, ask the user for permission to go past that limit before launching it.
7. **The script passes the mechanical check** (section 9). If it fails, it does not launch.

## 1. Verify by risk

| Level | What it is | Shape | How it is checked |
|---|---|---|---|
| 0 · Trivial | A word, a value, a label, anything reversible | Directly in the main session | One quick check from the main session: a test, a capture or a reread |
| 1 · Visual | Something the user will look at anyway: a board, a color, a framing, a sketch, a first draft | Directly, or a single agent that builds | No judge: send it and the user judges |
| 2 · Core | Work that other work builds on: shared code, a data model, an analysis, a plan, a research synthesis | The archetype workflow (section 4) | One review-and-judge step against the ask, with tests, captures or sources as evidence |
| 3 · For others | Decks, data sheets, anything that leaves the team | The deliverables flow (section 5) | Critique, then verification by source |

- **Level 0 is never a workflow.** Level 1 is a single agent that does the work and checks itself against the ask, with no review, judge or fix step, in 30 minutes at most.
- **Size check before any workflow.** Ask three questions: which level is it, what is the least that answers the user's message, and what can the main session do in under 10 minutes. Whatever comes from what the user just sent (photos, crops, numbers, a measurement), the main session works out and hands to the agent as data. If the user names a source, use only that source.
- **If the user asks for speed, drop one level,** and say so in the launch line.
- **If the user asks to do it without agents, do it without agents.** That instruction wins over any session mode.
- **If the user asks a question, answer it before executing.** That includes questions that sound rhetorical, such as "do you follow me?". If their latest message can be read as "wait", launch nothing until they clarify.
- **Size it in one line:** the pieces, the model of each phase and the time, marked as an estimate. If a part needs more than 60 minutes, ask the user before launching it: run it whole, or split it so part A builds and stops with something they can look at, and part B starts on their OK. If a step exists only out of habit, remove it and say so.

Estimate from your own measured durations. The heaviest build steps vary the most: estimate them with margin.

## 2. Which shape to use, by task

| Task | Level | Shape |
|---|---|---|
| Copy change, a label, a value | 0 | Direct. Targeted test or capture |
| Sketch, wireframe, board, mockup | 1 | Direct, in minutes, with the real labels. Capture to the user |
| Small visual tweak in the interface | 1 | Direct or one agent. Capture to the user in their framing |
| Interface change with new behavior | 2 | Archetype. Two reviews in parallel (visual and code) only if code and view both change |
| Change to core logic or a data model | 2 | Archetype. Build on the top model at high effort |
| Research | 2 | Mid-model readers in parallel, top-model synthesis and a top-model critic that tries to refute it |
| Analysis, plan or recommendation a decision rests on | 2 | Archetype. The build gives each claim its source; the judge checks claims, reasoning and gaps against the ask |
| Deck, data sheet or email with data for others | 3 | Deliverables flow (section 5) |

## 3. Model and effort per phase

| Model | What for |
|---|---|
| Small | Only very mechanical work: captures, renders, file checks, running tests and reporting, mechanical transformations. It does not read sources: that stays on the mid model |
| Mid | Reading, extraction, web search, shaping data into a schema, adopting existing files, bounded fixes |
| Top | Planning, synthesis, writing that has to land, review and judging, design critique, changes to core logic or design |
| The highest available | Only orchestrates, in the main session |

- **Effort is set per phase when the workflow is planned,** by what each step does, and goes with its reason in the phase table. There is no default effort. As a guide: low for mechanical work; medium for reading code or documents where a missed detail costs rework; high for planning, synthesis or building something hard, which spends much more on reasoning.
- **Per piece, not per phase:** in a fan-out, each piece goes to the model its risk calls for. Very mechanical work (captures, renders, contact sheets, running tests and reporting) goes to small at low. Reading sources or a bounded fix goes to mid at medium. Anything that can change the technical meaning goes to top at high.
- **A premium tier above the top model only when the user asks for it by name.** Until then, reviews run on the top model.
- ⛔ **Explicit model on every agent.** If it is left out, the agent inherits the session's model and the whole fan-out runs on the expensive one without warning.

## 4. The archetype workflow (level 2)

```
1. build              top model at high, or mid model at medium, depending on the step
                      builds, runs only the tests for what changed,
                      takes the minimum FRAMES and returns changes, evidence and open items
1b. captures          small model at low, optional: when FRAMES is a long closed list,
                      the small model takes the captures and makes the contact sheet instead of build
2. review and judge   top model at medium, one agent
                      reads the build's test results without rerunning them, reuses the captures,
                      tries to prove the work is not done, lists only real musts,
                      sets the row in the request list
3. fix                mid model at medium, only if there is a must
                      fixes and leaves its own test or capture
4. short review       top model at medium, only if the must was risky
                      reviews only those musts
5. main session       opens the main capture, confirms the files changed
                      and tells the user what matters
```

- A minor must is closed with the fix's test or capture, without another agent.
- At most two audit rounds. Whatever is still open goes to the user.
- **If the user says they will review it, drop the judge** and the work becomes level 1. If the workflow is already running, stop it right after the build (section 9).
- **Without code or screens** (research, analysis, plans), the evidence is sources and reasoning, not tests and captures. The build returns each claim with its source, and the judge checks the claims, the reasoning and what is missing against the ask.
- **Review against the intent, not only against the reference.** Design critique asks first whether there is one clear idea carried through every part, with good proportion, few parts and honest construction. The reference can be wrong too.

## 5. The deliverables flow (level 3)

For decks, data sheets and anything that goes to other people:

1. The workflow stops when the outline is done. The user approves titles and structure.
2. Critique comes first, with two lenses in parallel: a reader with no context and a risk reader. Fix the structure.
3. Verification by source comes last, on the stable outline. Claims are grouped by URL, the mid model reads the exact text and the top model judges. Prices, limits, security and compliance get two independent top-model judges; if they disagree, the claim stays out. If a fix adds claims, verify only those, until no new ones appear.
4. In internal design documents it is enough to compare each quote against the saved one, in the script and without agents.

## 6. What every prompt carries

Each script defines a few shared blocks and pastes them into every agent:

1. **AUTHORITY.** The user's latest message, verbatim and dated, plus the context and the intent. It must say that the main session answers the chat and that a relayed message does not cancel the approved task.
2. **FRAMES:** the closed list of captures. By default, the framing the user used plus one risk state. Light and dark themes, screen sizes, and long or short content only if the change touches them. Skipped states are named with the reason. Reviewers and judges **reuse** the captures.
3. **RULES.** Never invent data (write TBD, and mark analysis as analysis). Never touch other projects, vendored code or files with secrets. Which files it may edit. The shared lock for builds and browser runs. Targeted tests only.
4. **TASK.** What this agent does and what it ends with.
5. **Schema.** Always structured output: summary, changes, evidence, open items.

An agent writes long deliverables to a file and returns a summary and the path.

## 7. Spend tokens on purpose

This rule wins over any session mode that says cost does not matter.

1. **Pass paths, not whole reports.** Each agent writes its notes to a file and returns the path in `report`. The next step gets only the fields it needs (summary, tests, musts) and that path, and reads from there only what it needs. Never paste a whole report into a prompt.
2. **Images to measure.** Crops of the area that matters, reduced scale when it is enough, one contact sheet instead of loose captures, and captures reused.
3. **Read in parts.** Search first, then read ranges. In the main session, trim outputs with `tail` or `cut`.
4. **Effort is set when the workflow is planned** (section 3).
5. **Estimate and report tokens like time.** The total estimate when planning, and the real figure at the end, next to the minutes.
6. **What already saves:** verify by risk, review and judge in one, tests run once, and resuming from cache instead of running again.

Keep a table of your own measured runs (agents, minutes, tokens) to estimate the next one from.

## 8. Tests

- **Only the tests for what changed,** with the suite's filter, and only once: in the build. The judge reads them and does not rerun them.
- **The full suite only before a delivery to others or when something shared changes,** and say why.
- **Only one session at a time runs tests or builds.** Check running processes and the shared lock first.
- **A badly written test does not count as a pass.** If a test fails, the judge decides whether the defect is in the code or in the test.

## 9. Mechanical check and operation

**Before launching:**

1. Write the script to a file and check it, with a linter if you have one, or by reading it against this list:
   - An explicit model on every agent, and the premium tier only when the user asked for it.
   - A label on every agent in the form `role:item · effort`, with the same effort the agent runs at.
   - The AUTHORITY block in every prompt.
   - The level, 0 to 3, and a shape that matches it (section 1).
   - The estimate in minutes, and the user's permission if it is over 60.
   - The token estimate for the whole run.
   - A `FRAMES:` block when a prompt asks for captures, and "reuse" in reviewers and judges.
   - No full suite unless section 8 allows it.
   - No prompt pastes a whole report: only the fields it needs and the path.
2. Launch from the file.

**While it runs:**

- **A new request from the user** is done in the main session if it is small and does not clash with what is running. If not, it is assigned to the specific step that will take it. Never "for the next agent" if that agent already started: agents read their files when they start.
- **To stop before a step without losing the one running:** a background watcher waits for that step's result in the run's log, then stops the run.
- **To change a step that has not started:** stop after the previous one, edit only that step's prompt and relaunch, resuming from the cache. Unchanged steps come from the cache. If the shared blocks change, every step runs again.
- **A workflow that depends on another** launches when the first one has finished and its output has been checked, never with a step that waits for some file to exist.
- **The user watches the dev server:** nobody sweeps values through live code or leaves a file that does not compile. If their page freezes after a hot reload, reloading it is enough.

## 10. When it ends

1. **Read the result** (the full run log if the summary is cut off). Open the main capture and confirm the files changed. Do not repeat what the judge already checked.
2. **"Done" only with evidence:** a capture in the same framing as the user's screenshot. "Planned", "in the next round" or "noted" is not "done".
3. **Pass on what matters,** briefly, with the user's decisions numbered and a recommendation. The user does not see what an agent reports.
4. **Decisions with a recommendation do not stop the work:** take the recommended one, note it and report it at the end. Missing data is never inferred: it goes in as TBD or gets asked.
5. **Report the real minutes and tokens against the estimate,** with the figures, as they are.
6. **Update the request list** with each request's status and evidence. There is one living list: every message from the user goes into it in the same turn, with their words, the ask and a status, and progress reports come from it, never from memory.
