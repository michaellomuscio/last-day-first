# Last Day First

A planning tool, with a game around it, for teachers who are new to teaching. They build a real high school course backward (what should last, then the evidence, then the days) and an observer with a clipboard reads the design as they go: what students are doing minute by minute, who is doing the thinking, and whether the plan matches what the teacher said they wanted.

There is no AI inside. Everything a teacher builds is described by choosing from defined options, and the tool measures and checks it with rules. It runs in a browser from one file, with no account and no server.

## Use it

**https://michaellomuscio.github.io/last-day-first/**

Or open `docs/index.html` from this repository in a browser. That file is the whole tool.

- **Try the five-minute warm-up** first: a flawed lesson to repair while the label changes.
- **Start a new course**: pick a subject, a period length and how often the class meets, and say what you want your classroom to be like. Eight subjects have an optional starter kit.
- Work saves in the browser as you go. **Save file** downloads the course so it can be reopened later or handed to a mentor.

## What a teacher builds

Eight chapters. Each produces a real piece of the course.

| Chapter | What they do | What comes out |
| --- | --- | --- |
| 1. Goals | Write the course aim. Sort goals into lasting, important and worth meeting. Link each goal to the ideas it builds on. | The web of ideas |
| 2. Sequence | Lay out units, give each its days, questions and goals, and choose where the materials come from. | Scope and sequence |
| 3. Evidence | Before any lesson, design the major and minor assessments for each unit. | Assessment plan |
| 4. Calendar | Put the units on real dates with days off and a buffer. | Pacing guide |
| 5. Lessons | Build class periods from timed blocks while the classroom plays and the label updates. | Unit and lesson plans |
| 6. Homework | See every night's load across a unit and adjust it. | Homework plan |
| 7. Syllabus | Set grading weights and policies; watch the syllabus write itself. | Syllabus |
| 8. Report | Read the course back: grades, the course label, the fingerprint, the simulated class, every check. | Course report and the full packet |

## How a lesson is measured

A lesson is a strip of timed blocks. Each block is one of 45 classroom moves (lecture, worked example, think-pair-share, lab, seminar, exit ticket and so on). Every move carries what an observer would record:

- what students are doing, from 18 codes grouped into the nine lines of the label;
- whether they work alone, in pairs, in groups or as a whole class;
- who is doing the thinking;
- the purpose: taking in something new, making sense of it, or using it somewhere new;
- the thinking level, from recall to extended thinking;
- how much of the time students show what they know, and whether feedback comes while they can still use it.

Switches change how a move runs. Whole-class questions answered by volunteers put most students in "listening"; the same questions with everyone responding do not.

The tool adds the minutes a plan forgets (settling in, getting into groups, cleaning up) and shows whether the period runs past the bell.

## The Learning Facts label

Every lesson, unit and course gets one. It reports, among other things:

- minutes and share of time in each activity;
- taking it in, working with it, creating, and building with others;
- who does the thinking, and how students are grouped;
- purpose and thinking level;
- minutes students show what they know, and how much of that gets usable feedback;
- how long a typical student speaks, and the longest stretch in one mode;
- homework: nights, minutes, purpose, and how much needs a device;
- the design against the teacher's own stated intent.

The label compares a design with what the teacher said they wanted. It does not grade a teaching style, because the research does not support a "recommended amount" of lecture or group work.

## The report

- **Grades** in six areas (Alignment, Evidence, Feasibility, Practice and feedback, Workload, Intent), each traceable to specific findings from 34 checks. An area shows a dash until enough exists to judge it.
- **The fingerprint**: one ring per unit, first unit at the centre. Color is what students do, thickness is how much of the time asks for strategic or extended thinking, dots are major assessments.
- **The web of ideas**: a simulated class lives through the plan. Dots are goals, lines join a goal to what it builds on, and the picture can be read on the last planned day, eight weeks later, or as the teacher's own assessments would have shown it.
- **Stress test**: takes away the days a real year loses and runs it again.
- **Teach it twice**: save a version, redesign, and compare the two.
- **The packet**: scope and sequence, pacing guide, unit plans, lesson plans, assessment plan, homework plan, syllabus and the report, to print, save as PDF, or download for Word or as Markdown.

## What it is honest about

- It measures the plan, not the room.
- The shares on a label follow how each block is described. Change a block and they change.
- Setup and moving time are assumptions. No published figure exists for planned transitions, so the teacher sets the pace.
- The simulated class illustrates well-established findings about practice, spacing, feedback and forgetting. It is not a forecast of real students, and the report shows bands, not percentages.
- Several famous numbers in this field are weaker than their reputation. `research/` records what was verified, what was only found second-hand and what could not be confirmed.
- The approach is backward design, set out by Grant Wiggins and Jay McTighe. Their name for their framework is a registered trademark, so the tool describes the ideas in its own words and credits them.

## Starter kits

English 10, Algebra 1, Biology, United States History, Spanish 2, Studio Art 1, Introduction to Computer Science (Python), and Health and Wellness. Each has seven to nine units with questions, goals linked across units, a major assessment and two or three smaller checks per unit, and a built-out first week. They are scaffolds to rewrite. The Health kit's units on sexual health and on drugs should be checked against district and state rules before use.

## How it is built

Plain JavaScript, no dependencies, one generated HTML file of about 560 KB.

```
node build.js          # writes docs/index.html and dist/
node test/run.js       # engine tests
```

For the interface, open `dist/index.html?test=1`: a script visits every screen for every kit, the sample course and a blank one, clicks every button once, and reports `TEST n passed, m failed` in the console and the page title.

`SPEC.md` is the build contract: the course data model, the engine's functions, and the interface conventions. Read it before changing anything.

| Files | What they hold |
| --- | --- |
| `src/00-core.js` to `src/32-label.js` | Helpers, the vocabulary (codes, moves, option tables), the course model, the demo course, kit loading, the observer, the label |
| `src/35-checks.js` | The 34 design checks and the grades |
| `src/40-sim.js` | The simulated class and the stress test |
| `src/45-docs.js` | The documents in the packet |
| `src/kits/` | The eight starter kits |
| `src/50-ui-core.js` to `src/64-game.js` | The shell, the eight screens, the warm-up and banners |
| `src/95-devtest.js` | The click-through test |
| `src/css/` | Styles, one file per screen |
| `research/` | The three research briefs the design rests on, with sources |
| `test/` | Engine tests |

Files numbered below 50 never touch the page, so the same code runs in Node for the tests.

Preview hooks: `dist/index.html?demo=1&view=lessons&unit=1&lesson=3`, `?kit=math&view=calendar`, and `&click=` followed by CSS selectors separated by `|` to click through a sequence.

## Not built yet

- Feedback on what teachers write in their own words. That would need AI and a hosted service.
- A school profile that sets house expectations for the grades.
- A view for a mentor or department across several teachers' courses.
- A companion for real classroom visits using the same codes, to compare the design with what was observed.
