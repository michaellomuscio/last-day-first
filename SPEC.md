# Last Day First: build contract

A planning tool, with a game around it, for teachers who are new to teaching. They build a real high school course backward (goals first, then evidence, then days) and a simulation reads the design as they go. No AI inside: everything a teacher makes is described by picking from defined options, and the tool measures and checks it with rules.

Plain JavaScript, no dependencies, one generated HTML file. `node build.js` joins `src/` into `dist/index.html` and writes `dist/engine.cjs` for tests.

## Ground rules for everyone writing code here

- **One shared scope.** All `src/*.js` files are concatenated into a single script in filename order. Top-level `const` and `function` names are global to the app, so never redeclare a name another file uses. Prefix private helpers with your module's short name.
- **Own only your files.** Each task names the files it owns. Do not edit other files. If you need a change elsewhere, say so in your final report.
- **Engine files (`00-` to `49-`) must not touch `document` or `window`.** They run in Node. Add every name tests need to `src/exports.txt` (append a line; names separated by spaces).
- **Tests** live in `test/<name>.js`, use `require('../dist/engine.cjs')`, print a short summary and exit non-zero on failure. Run `node build.js` first.
- **No AI, no network, no accounts.** The only outside request is Google Fonts.
- **Words.** Plain English a first-year teacher understands without training. Short sentences. No jargon without a plain definition beside it. No exclamation marks, no emoji. Do not use the phrases "Understanding by Design" or "UbD" in the product (they are trademarks); say "backward design".
- **Honesty.** The tool measures the plan, not the room, and it must never present an assumption as a finding. Where a rule rests on research, name the source in a code comment and keep the on-screen claim modest. Read `research/*.md` before inventing any threshold; if the research says a number is weak or unverified, do not turn it into a hard rule.
- Never judge lecturing, group work or any single method as bad by rule. Report what students are doing and compare it with the teacher's own stated intent (`course.intent`).

## The course object (`src/20-model.js`)

```
course = {
  v, title, subject, grade, teacher, seq,
  school: { period (minutes), perWeek (5|4|3|2.5|2|1), start, end (ISO dates), off: [ISO dates], lost (days), pace (0.5|1|1.5), classSize },
  intent: { active, together, high (percent targets), hw (max minutes a night) },
  transfer: string,                       // what students should be able to do on their own, years later
  goals:   [{ id, text, kind: understanding|knowledge|skill, priority: lasting|important|familiar, level: 1..4, unit: unitId|null, after: [goalIds it builds on] }],
  units:   [{ id, title, days (class meetings budgeted), questions: [string], source: adopt|curate|borrow|build, sourceNote, note }],   // array order is teaching order
  lessons: [{ id, unit, title, days (>=1), blocks: [block], hw: homework|null, note }],                                              // array order within a unit is teaching order
  assess:  [{ id, unit, title, kind: major|minor, method: selected|written|performance|personal, targets: [knowledge|reasoning|skill|product],
              level: 1..4, goals: [goalIds], min (in class), out (minutes outside class), fb: none|score|rubric|comments|conference, back (days until returned),
              rubric: none|holistic|analytic|single, retake: bool, role, audience, product, note }],
  syllabus: { about, materials, weights: { major, minor, homework, participation }, late: string id, retake: string id, contact, help, honesty },
  game: { warm, seen: {}, banners: {} }, snaps: [],
}
block    = { id, move (id in MOVES), min, goals: [goalIds], sw: { switchId: optionId }, lv?, pu?, assess?: assessId, note }
homework = { purpose: practice|review|prepare|extend|finish, kind: problems|reading|writing|watch|project|study, min, goals: [goalIds], fb: none|check|discussed|scored|comments, graded: no|completion|accuracy, device: bool }
```

Option tables with labels and one-line definitions are in `src/10-codes.js`: `CODES` (18 things a student can be doing), `FAMILIES` (the 9 label lines, with colors), `ICAP`, `THINKERS`, `GROUPINGS`, `PURPOSES` (A take in, M make meaning, T transfer, N routine), `LEVELS`, `GOAL_KINDS`, `PRIORITIES`, `METHODS`, `TARGETS`, `FEEDBACKS`, `RUBRICS`, `HW_*`, `SOURCES`, `SUBJECTS`, `MOVES` (45 classroom moves with tags and switches), `PATTERNS` (ready-made lesson shapes).

Model helpers: `newCourse`, `migrate`, `addGoal/addUnit/addLesson/addBlock/addAssess`, `newHomework`, `applyPattern`, `removeUnit/removeGoal/removeAssess`, `unitOf/goalOf/lessonOf/assessOf`, `unitLessons/unitAssess/unitGoals`, `plannedDays`, `blockEff(block)` (the move with switches applied: `{move, mix, g, th, pu, lv, show, fb, talk, setup, cleanup, arr, retr, think}`), `meetingDates(c)`, `availableDays(c)`, `budgetedDays(c)`, `unitSpans(c)`. `demoCourse()` returns a small complete Biology course for tests and previews.

## The observer (`src/30-analyze.js`)

`lessonLabel(c, lesson)`, `unitLabel(c, unitId)`, `courseLabel(c)` return a **label**, all in student-minutes:

```
{ days, time (period minutes x days), planned, overhead, total, over (minutes past the bell, lessons only; summed overruns otherwise), learn (total less overhead),
  byCode: {code: min}, fam: {familyId: min}, icap: {P,A,C,I,N}, thinker: {teacher,shared,together,alone}, group: {alone,pair,group,class},
  purpose: {A,M,T,N}, level: {1..4}, show (minutes showing what they know), fbNow, fbLater, talk (minutes a typical student speaks), retr (retrieval events),
  orphan (learning minutes tied to no goal), stretch: {min, fam} (longest run in one family), goals: {goalId: {min, A, M, T, retr, show, fb, lv}},
  segs (lessons only: timeline of {t0, t1, block|over, arr, mix}), hw (units and courses: homeworkStats), budget, overDays, available }
```

`shares(label)` gives 0..1 values: `active, receive, creating, overhead, together, alone, whole, high, students, show, fed`.
`homeworkStats(c, lessons)` gives `{nights, days, total, max, avg (per class day), avgNight, purpose, kind, fb, graded, device, list}`.
`courseDays(c)` is the course as an ordered list of class days `{i, date, unit, lesson|null, label|null, hw|null}` (a unit's unplanned days have `lesson: null`).
`goalMap(c)` gives, per goal id, `{goal, min, A, M, T, retr, show, fb, lv, days: [day indexes], hwMin, hwDays, assess: [assessIds]}`.
`methodFit(assessment)` is 2 strong, 1 workable, 0 poor (target-method match).

## Interface contract (files `50-` and up)

- `App` holds state: `App.c` (the course), `App.view`, `App.sel = { unit, lesson, block, assess, goal }`.
- A workspace registers itself: `VIEWS.myview = { name: 'Evidence', render(c) { return html; }, after(root) { /* optional, after the HTML is in the page */ } }`. It renders the whole main area as one HTML string. The shell calls `render` again after any change.
- Actions: `<button data-act="name" data-arg="...">` calls `ACT.name(arg, App.c, element, event)`. After an action the shell saves and re-renders, unless the action returns `false`.
- Two-way binding without re-rendering while typing: `data-bind="kind:id:prop"` on `input`, `textarea` or `select`. Kinds: `course`, `school`, `intent`, `syllabus`, `weights`, `goal`, `unit`, `lesson`, `hw` (id is the lesson id), `assess`, `block` (id is `lessonId/blockId`). Add `data-num` for numbers. Elements carrying `data-live="key"` are refreshed in place on every input; a full render happens on `change`.
- Built-in actions: `set` (`"kind:id:prop=value"`), `toggle` (adds or removes `value` in an array prop), `go` (`"viewId"`), `sel` (`"unit=U1"` and so on).
- HTML helpers (return strings): `seg(path, options, current)`, `chips(path, options, currentArray)`, `field(path, value, attrs)`, `area(path, value, attrs)`, `stepper(path, value, min, max, step)`, `pick(path, options, current)` (a select), `goalPicker(path, goals, selected)`, `tag(text, tone)`, `empty(text, buttonHtml)`, `labelHTML(label, opts)`, `mentor(lines)`, `toast(text)`. Options are arrays like the tables in `10-codes.js` (`[id, label, hint]`).
- CSS: each workspace may add `src/css/NN-name.css`. Use the tokens and the component classes in `src/css/00-base.css`; do not restyle shared classes.
- Preview hooks for screenshots and tests: `dist/index.html?demo=1&view=<viewId>&unit=1&lesson=3`.

## Files and owners

| File | Holds |
| --- | --- |
| `00-core.js`, `10-codes.js`, `20-model.js`, `25-demo.js`, `30-analyze.js` | Core, vocabulary, model, demo course, observer |
| `35-checks.js` | Design checks and grades |
| `40-sim.js` | The simulated class |
| `45-docs.js` | Document generators for export |
| `kits/*.js` | Subject starter kits |
| `50-ui-core.js` and up | The interface |
